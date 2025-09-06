---
    title: "{{ replace .Name "-" " " | title }}"
    date: {{ .Date }}
    draft: true
    name: "{{ replace .Name "-" " " | title }}"
    role: "Ruolo dell'organizzatore"
    description: "Organizzatori."
    image: "/images/organizers/default-organizer.jpg"
    weight: 10
---