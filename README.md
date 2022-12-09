# GitHub Publisher

This is a simple tool to publish a GitHub repository by bumping the version number in the `package.json` file, creating
a new tag, creating a release branch, merging the release branch into the master and|or staging branch, create a GitHub
release and pushing the changes to remote.

## Installation

```bash
npm install -g github-publisher
```

## Usage

The basic usage requires only to specify the version increment type. This changes will be pushed by default to `staging`
branch. In this case, no release will be done.

Release will be done only when choosing `main` or `master` branch.

### Arguments

- `versionIncrement` - The version increment to apply to the `package.json` file. Can be one of `major`, `minor`
  or `patch`.

### Options

- `-b | --branch <destinationBranch>` - Branch where the release will be created. Defaults to `staging`.
- `-r | --onlyRelease` - Only create the release branch and tag. Do not merge the release branch into the destination
  branch.
- `-e | --exportVersion <filePath>` - Export the new version to the specified file.
- `-ee | --onlyExportVersion <filePath>` - ONLY Export the new version to the specified file, without doing any other thing.
- `--ignoreUncommitted` - Do not check if there are uncommitted changes in the working directory.

```bash
# Show help
ghp --help

# Publish a new release and merge into the staging branch
# This won't create a new release
ghp patch

# Publish a new release and merge into the main branch
# This will create a new release
ghp patch -b main

# Publish a new release and merge into the staging and master branch
# This will create a new release
ghp minor -b staging,main

# Same as above, but also export the new version to a file
ghp major -b staging,main -e bin/version 

# Create only the release without bumping version, tag creation or merging
ghp --onlyRelease

# Create only the release without bumping version or merging while ignoring uncommitted changes
ghp --onlyRelease --ignoreUncommitted

# Export the new version to a file called "version" inside the folder "bin"
ghp --onlyExportVersion bin/version
```

    
