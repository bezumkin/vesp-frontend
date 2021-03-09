export default ({app}) => {
  app.i18n.getChoiceIndex = (choice, choicesLength) => {
    // If there are pluralization rules
    if (app.i18n.locale in app.i18n.pluralizationRules) {
      return app.i18n.pluralizationRules[app.i18n.locale].apply(app.i18n, [choice, choicesLength])
    }

    if (app.i18n.locale.toLowerCase() === 'ru') {
      // Default Russian rules
      if (choice === 0) {
        return 0
      }
      const teen = choice > 10 && choice < 20
      const endsWithOne = choice % 10 === 1

      if (choicesLength < 4) {
        return !teen && endsWithOne ? 1 : 2
      }
      if (!teen && endsWithOne) {
        return 1
      }
      if (!teen && choice % 10 >= 2 && choice % 10 <= 4) {
        return 2
      }

      return choicesLength < 4 ? 2 : 3
    }

    // Other languages
    choice = Math.abs(choice)
    if (choicesLength === 2) {
      return choice ? (choice > 1 ? 1 : 0) : 1
    }

    return choice ? Math.min(choice, 2) : 0
  }
}
