dist=dist
dist_gitlab_vscode_extension=$(dist)/gitlab-vscode-extension
dist_gitlab_extension_tar=$(dist)/gitlab-extension.tar.gz
dist_gitlab_vscode_extension_dist_browser=$(dist_gitlab_vscode_extension)/dist-browser

gitlab_vscode_extension_version_json=gitlab_vscode_extension_version.json

# what: If we don't have a gitlab_vscode_extension_version.local.json, use the one in source control
ifeq (,$(wildcard gitlab_vscode_extension_version.local.json))
	gitlab_vscode_extension_version_json=gitlab_vscode_extension_version.json
else
	gitlab_vscode_extension_version_json=gitlab_vscode_extension_version.local.json
endif
extension_type=$(shell node -p -e 'require("./$(gitlab_vscode_extension_version_json)").type')
extension_location=$(shell node -p -e 'require("./$(gitlab_vscode_extension_version_json)").location')

.PHONY: .before .after .validate clean

.validate:
	@test -f $(gitlab_vscode_extension_version_json) || (echo "Error: $(gitlab_vscode_extension_version_json) not found" && exit 1)
	@test -n "$(extension_type)" || (echo "Error: extension type not defined in JSON" && exit 1)
	@test -n "$(extension_location)" || (echo "Error: extension location not defined in JSON" && exit 1)
	@echo "✅ Configuration validated"

# what: No matter what the version "type" is, we always run this before the main recipe
.before:
	rm -rf $(dist_gitlab_vscode_extension)
	mkdir -p $(dist)

# what: No matter what the version "type" is, we always run this after the main recipe
.after:
	rm -rf $(dist_gitlab_vscode_extension)/node_modules/.bin
	# Touch so that we consider this "updated" for Makefile's calc
	touch $(dist_gitlab_vscode_extension)

clean:
	rm -rf $(dist)
	@echo "🧹 Cleaned build artifacts"


# ============
# region: type === url
# ============
ifeq ($(extension_type),url)

# what: Main target that builds the dist-browser folder
$(dist_gitlab_vscode_extension): $(dist_gitlab_vscode_extension_dist_browser)

# what: Build the browser version after extracting
$(dist_gitlab_vscode_extension_dist_browser): $(dist_gitlab_extension_tar)
	make .before
	mkdir -p $(dist_gitlab_vscode_extension)
	tar -xzf $(dist_gitlab_extension_tar) -C $(dist_gitlab_vscode_extension) --strip-components 1
	(cd $(dist_gitlab_vscode_extension) && npm install && npm run build:browser)
	make .after

$(dist_gitlab_extension_tar): $(gitlab_vscode_extension_version_json)
	make .validate
	mkdir -p $(dist)
	rm -rf $(dist_gitlab_extension_tar)
	curl -L $(extension_location) --output $(dist_gitlab_extension_tar)

endif
