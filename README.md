# Bible Callout

Effortlessly insert Bible verses in [Obsidian](https://obsidian.md).

## Usage

To use the Bible Callout, insert the following [code block](https://help.obsidian.md/Editing+and+formatting/Basic+formatting+syntax#Code+blocks) in the Obsidian file:

````
```[translation]
[book] [chapter]:[verses]
```
````

### Example

Create the code block manually or use the "Bible Callout: Insert NASB callout" command.

````
```NASB
Romans 10:9-10
```
````

Move the cursor outside the code block, and it will display the callout:

![Obsidian screenshot](images/screenshot.png)

### Full Chapter

An entire chapter can be displayed by omitting the verse.

````
```NIV
Psalms 23
```
````

## Notes

An internet connection is required to fetch Bible content. There may be an update in the future to provide offline translations.

## Roadmap

Cache data inside the vault for offline support, faster loading and fewer network request.

## Credits

Data provided by [bolls.life](https://bolls.life).
