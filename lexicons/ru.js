export default {
  actions: {
    create: 'Создать',
    edit: 'Изменить',
    delete: 'Удалить',
  },
  components: {
    confirm_delete_title: 'Требуется подтверждение',
    confirm_delete_message: 'Вы уверены, что хотите удалить эту запись?',
    confirm_yes: 'Да',
    confirm_no: 'Нет',
    table: {
      no_data: 'Нет данных для вывода',
      no_results: 'Результатов не найдено',
      records: 'Записей нет | 1 запись | {total} записи | {total} записей',
      query: 'Поиск...',
      columns: {
        id: 'Id',
        created_at: 'Создано',
        updated_at: 'Обновлено',
        actions: 'Действия',
        image: 'Картинка',
      },
    },
    modal: {
      submit: 'Отправить',
      cancel: 'Отмена',
      close: 'Закрыть',
    },
    /*
    upload: {
      loading: 'Подготовка',
      processing: 'Загрузка',
      cancel: 'Отмена',
      awaiting_size: 'Ожидание размера',
      sorting_desc: 'Вы можете сотрировать картинки перетаскиванием',
      records: 'Нет файлов | 1 файл | {total} файла | {total} файлов',
      max_file_size: 'Максимальный размер файла {filesize}',
      max_file_size_exceeded: 'Файл слишком большой',
    }, */
  },
  errors: {
    error: 'Ошибка',
    access_denied: 'Доступ запрещён',
    http401: 'Ошибка 401: Требуется авторизация',
    http403: 'Ошибка 403: Доступ запрещён',
    http404: 'Ошибка 404: Не найдено',
    http500: 'Ошибка 500: Ошибка сервера',
    http0: 'Неизвестная ошибка',
  },
}
