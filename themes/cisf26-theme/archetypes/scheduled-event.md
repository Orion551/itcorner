---
title: "{{ replate .Name "-" " " | title }}"
date: {{ .Date }}
draft: true
name: "{{ replace .Name "-" " " | title }}"
address: "{{ replace .Name "-" " " | title }}"
coverImage: ""
---