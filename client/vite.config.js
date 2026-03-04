import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { spawn } from 'node:child_process'
import process from 'node:process'

const AXIOM_BACKEND_URL = 'http://127.0.0.1:3000/health'

const autoStartBackendPlugin = () => {
    let backendProcess = null

    const shouldAutoStart = () => (
        String(process.env.VITE_AUTOSTART_BACKEND || 'true').toLowerCase() === 'true'
    )

    const isBackendHealthy = async () => {
        try {
            const response = await fetch(AXIOM_BACKEND_URL, { method: 'GET' })
            return response.ok
        } catch {
            return false
        }
    }

    const teardown = () => {
        if (!backendProcess || backendProcess.killed) return
        backendProcess.kill('SIGTERM')
        backendProcess = null
    }

    return {
        name: 'axiom-autostart-backend',
        apply: 'serve',
        async configureServer(server) {
            if (!shouldAutoStart()) return
            if (backendProcess) return
            if (await isBackendHealthy()) return

            const serverDir = fileURLToPath(new URL('../server', import.meta.url))
            const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'

            backendProcess = spawn(npmCommand, ['run', 'dev:safe'], {
                cwd: serverDir,
                env: {
                    ...process.env,
                    NODE_ENV: 'development',
                },
                stdio: ['ignore', 'pipe', 'pipe'],
            })

            backendProcess.stdout?.on('data', (chunk) => {
                const output = String(chunk || '').trim()
                if (output) {
                    console.log(`[axiom-backend] ${output}`)
                }
            })

            backendProcess.stderr?.on('data', (chunk) => {
                const output = String(chunk || '').trim()
                if (output) {
                    console.error(`[axiom-backend] ${output}`)
                }
            })

            backendProcess.on('exit', (code) => {
                if (code !== 0 && code !== null) {
                    console.error(`[axiom-backend] exited with code ${code}`)
                }
                backendProcess = null
            })

            server.httpServer?.once('close', teardown)
            process.once('SIGINT', teardown)
            process.once('SIGTERM', teardown)
            process.once('exit', teardown)
        },
    }
}

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), autoStartBackendPlugin()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (!id.includes('node_modules')) return
                    if (id.includes('firebase')) return 'vendor-firebase'
                    if (id.includes('react-router-dom')) return 'vendor-router'
                    if (
                        id.includes('framer-motion')
                        || id.includes('/motion/')
                        || id.includes('react-lenis')
                        || id.includes('@studio-freight')
                        || id.includes('/ogl/')
                    ) {
                        return 'vendor-motion'
                    }
                    if (id.includes('lucide-react')) return 'vendor-icons'
                    if (id.includes('react-dom') || id.includes('/react/')) return 'vendor-react'
                    return 'vendor-misc'
                },
            },
        },
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                secure: false,
            }
        }
    }
})
