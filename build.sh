function build() {
    build_type=$1
    build_dir="build/$build_type"

    mkdir -p "$build_dir/dist"

    cp -r dist build/$build_type/
    cp 128.png build/$build_type/128.png

    if [ "$build_type" = "firefox" ]; then
        cp firefox_manifest.json build/$build_type/manifest.json
    else
        cp manifest.json build/$build_type/manifest.json
    fi
    pushd build/$build_type
    rm ../pasrs-helper.$build_type.zip
    zip -r ../pasrs-helper.$build_type.zip .
    popd
}

function build_source_zip_with_gitignore() {
    source_zip_name="pasrs-helper.source.zip"
    echo "Creating source code zip (respecting gitignore): $source_zip_name"

    # Get a list of files tracked by git, excluding directories and the zip file itself
    # --cached: list files in the index
    # --exclude-standard: include the .gitignore logic
    # -z: null-terminate entries (safer for filenames with spaces or special characters)
    # | xargs -0 zip ...: pipe the null-terminated list to xargs, which then calls zip
    git ls-files --cached --exclude-standard -z | \
        xargs -0 zip "$source_zip_name" \
        || { echo "Error creating source code zip"; exit 1; }

    echo "Successfully created source code zip: $source_zip_name"
    mv $source_zip_name "build/$source_zip_name"
}

bun i
bun run build

rm -rf build

build chrome
build firefox

build_source_zip_with_gitignore
