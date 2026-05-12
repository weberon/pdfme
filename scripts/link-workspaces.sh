cd packages

for dir in $(ls -d */); do
    cd "$dir"
    npm_config_ignore_scripts=true npm link
    cd ..
done

for dir in generator ui; do
    cd "$dir"
    npm_config_ignore_scripts=true npm link @weberon/common
    npm_config_ignore_scripts=true npm link @weberon/schemas
    if [ "$dir" = "ui" ]; then
        npm_config_ignore_scripts=true npm link @weberon/converter
    fi
    cd ..
done
