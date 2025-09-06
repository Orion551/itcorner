---
    title: "{{ replace .Name "-" " " | title }}"
    date: {{ .Date }}
    draft: true
    name: "{{ replace .Name "-" " " | title }}"
    role: "Ruolo dell'organizzatore"
    description: "{{ replace .Name "-" " " | title }} - Organizzatrice"
    image: "/images/organizers/default-organizer.jpg"
    weight: 10
---