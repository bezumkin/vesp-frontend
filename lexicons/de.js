export default {
  actions: {
    create: 'Erstellen',
    edit: 'Bearbeiten',
    delete: 'Löschen',
    submit: 'Speichern',
    cancel: 'Abbrechen',
    close: 'Schließen',
  },
  components: {
    confirm_delete_title: 'Bestätigung erforderlich',
    confirm_delete_message: 'Möchten Sie diesen Eintrag wirklich löschen?',
    confirm_yes: 'Ja',
    confirm_no: 'Nein',
    table: {
      no_data: 'Nichts zu zeigen',
      no_results: 'Nichts gefunden',
      records: 'Keine Einträge | 1 Datensatz | {totalRows} Einträge',
      query: 'Suche...',
      columns: {
        id: 'Id',
        created_at: 'Erstellt am',
        updated_at: 'Aktualisiert am',
        actions: 'Aktionen',
        image: 'Bild',
      },
    },
    datePicker: {
      placeholder_date: 'Wählen Sie ein Datum',
      placeholder_range: 'Wählen Sie einen Zeitraum',
      months: [
        'Januar',
        'Februar',
        'März',
        'April',
        'Mai',
        'Juni',
        'Juli',
        'August',
        'September',
        'Oktober',
        'November',
        'Dezember',
      ],
      monthsShort: ['Jan', 'Feb', 'März', 'Apr', 'Mai', 'Juni', 'Juli', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
      weekdays: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
      weekdaysShort: ['So.', 'Mo.', 'Di.', 'Mi.', 'Do.', 'Fr.', 'Sa.'],
      weekdaysMin: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
    },
    /*
    upload: {
      loading: 'Vorbereiten',
      processing: 'Wird geladen',
      cancel: 'Stornieren',
      awaiting_size: 'Warten auf Dateigröße',
      sorting_desc: 'Sie können Elemente per Drag & Drop sortieren',
      records: 'Keine Dateien | 1 Datei | {total} Dateien',
      max_file_size: 'Die maximale Dateigröße beträgt {filesize}',
      max_file_size_exceeded: 'Datei ist zu groß',
    }, */
  },
  errors: {
    error: 'Error',
    access_denied: 'Zugriff verweigert',
    http401: 'Error 401: Anmeldung erforderlich',
    http403: 'Error 403: Autorisierung erforderlich',
    http404: 'Error 404: Nicht gefunden',
    http500: 'Error 500: Backend-Fehler',
    http0: 'Unbekannter Fehler',
  },
}
