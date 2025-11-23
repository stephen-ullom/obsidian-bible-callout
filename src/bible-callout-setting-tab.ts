import { App, PluginSettingTab, Setting } from "obsidian";

import { BibleCalloutPlugin } from "./bible-callout-plugin";

import languages from "./data/languages.json";

export class BibleCalloutSettingTab extends PluginSettingTab {
    plugin: BibleCalloutPlugin;

    constructor(app: App, plugin: BibleCalloutPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();
        containerEl.createEl("h1", {
            text: "Bible Callout Settings",
        });

        // Enabled translations
        new Setting(containerEl).setName("Enabled translations").setHeading();
        const enabledList = containerEl.createDiv("enabled-translations-list");

        // Available translations
        new Setting(containerEl).setName("Available translations").setHeading();
        const languageSetting = new Setting(containerEl).setName("Language");
        const availableList = containerEl.createDiv(
            "available-translations-list"
        );

        languageSetting.addDropdown((dropdown) => {
            languages.forEach((language, index) =>
                dropdown.addOption(index.toString(), language.language)
            );

            dropdown.setValue(this.plugin.settings.selectedLanguage.toString());

            dropdown.onChange(async (value) => {
                this.plugin.settings.selectedLanguage = value;

                await this.plugin.saveSettings();

                this.updateList(enabledList, availableList);
            });
        });

        this.updateList(enabledList, availableList);
    }

    updateList(enabledList: HTMLElement, availableList: HTMLElement) {
        enabledList.empty();
        availableList.empty();

        languages
            .map((language, index) => {
                const isSelectedLanguage =
                    index.toString() == this.plugin.settings.selectedLanguage;

                if (isSelectedLanguage) {
                    language.translations
                        .sort((a, b) =>
                            a.short_name.localeCompare(b.short_name)
                        )
                        .forEach((translation) => {
                            const name = translation.short_name;

                            const isNotEnabled =
                                !this.plugin.settings.selectedTranslations.contains(
                                    name
                                );

                            if (isNotEnabled) {
                                new Setting(availableList)
                                    .setName(translation.short_name)
                                    .setDesc(translation.full_name)
                                    .addButton((button) => {
                                        button.setButtonText("Add");

                                        button.onClick(async () => {
                                            this.plugin.settings.selectedTranslations.push(
                                                name
                                            );

                                            await this.plugin.saveSettings();

                                            this.plugin.updateCommands();

                                            this.updateList(
                                                enabledList,
                                                availableList
                                            );
                                        });
                                    });
                            }
                        });
                }

                return language.translations;
            })
            .flat()
            .sort((a, b) => a.short_name.localeCompare(b.short_name))
            .forEach((translation) => {
                const name = translation.short_name;

                if (this.plugin.settings.selectedTranslations.contains(name)) {
                    new Setting(enabledList)
                        .setName(translation.short_name)
                        .setDesc(translation.full_name)
                        .addButton((button) => {
                            button.setButtonText("Remove");

                            button.onClick(async () => {
                                this.plugin.settings.selectedTranslations.remove(
                                    name
                                );

                                await this.plugin.saveSettings();

                                this.plugin.updateCommands();

                                this.updateList(enabledList, availableList);
                            });
                        });
                }
            });
    }
}
