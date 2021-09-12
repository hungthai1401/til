---
title: Get the language code from a country code in PHP
category: PHP
date: 2021-09-12
---

Requires:

- PHP `Intl` extension

The peace of code:

```php
function getLanguage(string $country): string {
    $subtags = \ResourceBundle::create('likelySubtags', 'ICUDATA', false);
    $country = \Locale::canonicalize('und_'.$country);
    $locale = $subtags->get($country) ?: $subtags->get('und');
    return \Locale::getPrimaryLanguage($locale);
}
```

Refs:

- https://newbedev.com/is-there-a-simple-way-to-get-the-language-code-from-a-country-code-in-php
