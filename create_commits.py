import os
import subprocess
import time
import random

# First, unstage everything
subprocess.run(["git", "reset", "HEAD"])

# Get the list of modified/untracked files
result = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True)
lines = result.stdout.strip().split('\n')

files = []
for line in lines:
    if not line:
        continue
    # handle renames or spaces, porcelain format is usually " M file" or "?? file"
    status = line[:2]
    filepath = line[3:]
    files.append((status, filepath))

print(f"Total files to commit: {len(files)}")

# Shuffle slightly to make it look realistic? The user didn't ask for shuffle, just 50-100 commits.
# We will just iterate and commit 1 file at a time. This will result in exactly len(files) commits.

def get_message(status, filepath):
    basename = os.path.basename(filepath)
    if status.strip() == "D":
        return f"Remove {basename}"
    elif status.strip() == "A" or status.strip() == "??":
        return f"Add {basename}"
    else:
        return f"Update {basename}"

for i, (status, filepath) in enumerate(files):
    # Add file
    # For deleted files, we need git rm or git add -u
    # git add --all filepath works for all
    subprocess.run(["git", "add", "--all", filepath])
    
    msg = get_message(status, filepath)
    
    # Commit
    subprocess.run(["git", "commit", "-m", msg])

print("Finished creating commits.")
