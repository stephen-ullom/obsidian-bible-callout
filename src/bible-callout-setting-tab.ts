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
        containerEl.createEl("h2", {
            text: "Bible Callout Settings",
        });

        const languageSetting = new Setting(containerEl).setName("Language");
        const translationListEl = containerEl.createDiv("translation-list");

        languageSetting.addDropdown((dropdown) => {
            languages.forEach((language, index) =>
                dropdown.addOption(index.toString(), language.language)
            );

            dropdown.setValue(this.plugin.settings.selectedLanguage.toString());

            dropdown.onChange(async (value) => {
                this.plugin.settings.selectedLanguage = value;

                await this.plugin.saveSettings();

                this.updateList(translationListEl);
            });
        });

        this.updateList(translationListEl);
    }

    updateList(container: HTMLElement) {
        const index = this.plugin.settings.selectedLanguage;
        const translations = languages[parseInt(index)].translations;

        container.empty();

        translations
            .sort((a, b) => a.short_name.localeCompare(b.short_name))
            .forEach((translation) => {
                new Setting(container)
                    .setName(translation.short_name)
                    .setDesc(translation.full_name)
                    .addToggle((toggle) => {
                        const name = translation.short_name;
                        toggle.setValue(
                            this.plugin.settings.selectedTranslations.includes(
                                name
                            )
                        );

                        toggle.onChange(async (value) => {
                            if (value) {
                                this.plugin.settings.selectedTranslations.push(
                                    name
                                );
                            } else {
                                const index =
                                    this.plugin.settings.selectedTranslations.indexOf(
                                        name
                                    );
                                if (index > -1) {
                                    this.plugin.settings.selectedTranslations.splice(
                                        index,
                                        1
                                    );
                                }
                            }

                            await this.plugin.saveSettings();

                            this.plugin.updateCommands();
                        });
                    });
            });
    }
}
