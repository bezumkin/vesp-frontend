export default {
  actions: {
    create: 'Créer',
    edit: 'Éditer',
    delete: 'Effacer',
    save: 'Sauvegarder',
    submit: 'Soumettre',
    cancel: 'Annuler',
    close: 'Proche',
    ok: 'Ok',
  },
  components: {
    confirm: {
      title: 'Confirmation requise',
      message: 'Es-tu sûr?',
    },
    table: {
      no_data: 'Rien à afficher',
      no_results: 'Rien trouvé',
      records: 'Aucun article | 1 article | {total} 10 articles',
      query: 'Chercher...',
      delete: {
        title: 'Confirmation requise',
        confirm: 'Êtes-vous sûr de vouloir supprimer cette entrée?',
      },
    },
    datePicker: {
      placeholder_date: 'Choisissez une date',
      placeholder_range: 'Choisissez une période',
      months: [
        'Janvier',
        'Février',
        'Mars',
        'Avril',
        'Mai',
        'Juin',
        'Juillet',
        'Août',
        'Septembre',
        'Octobre',
        'Novembre',
        'Décembre',
      ],
      monthsShort: ['Jan', 'Fév', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'],
      weekdays: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
      weekdaysShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
      weekdaysMin: ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'],
    },
  },
  errors: {
    error: 'Erreur',
    access_denied: 'Accès refusé',
    http401: 'Erreur 401: Autorisation requise',
    http403: 'Erreur 403: Accès refusé',
    http404: 'Error 404: Not Found',
    http500: 'Erreur 500 : Erreur de serveur',
    http0: 'Erreur inconnue',
  },
}
