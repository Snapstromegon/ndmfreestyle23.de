---
eleventyNavigation:
  icon: more_vert
  key: Mehr
  order: 1000
layout: "layouts/page.njk"
tags: ["page"]
---

# Mehr

{% set navPages = collections.all | eleventyNavigation("more") %}

<ul class="link_list">
{%- for entry in navPages %}
  <li>
    <snap-ripple><a href="{{ entry.url }}" {% if entry.url == page.url %}active{% endif %} {% if entry.url.startsWith("http") %} target="_blank" {% endif %}><i class="material-icon">{{ entry.icon}}</i><span>{{ entry.title }}</span></a></snap-ripple>
  </li>
{%- endfor %}
</ul>
