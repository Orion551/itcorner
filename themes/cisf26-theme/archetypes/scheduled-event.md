---
title: "{{ replace .Name "-" " " | title }}"
event_date: {{ .Date.Format "2006-01-02T15:04:05" }}
draft: true
name: "{{ replace .Name "-" " " | title }}"
address: "{{ replace .Name "-" " " | title }}"
day: "monday"
weight: 10
# Cover Image
coverImage: ""
speakers: []
# description: ""
start_time: "09:00"
end_time: "10:30"
context: "all"
---
