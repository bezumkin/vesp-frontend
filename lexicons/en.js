export default {
  actions: {
    create: 'Create',
    edit: 'Edit',
    delete: 'Delete',
  },
  components: {
    confirm_delete_title: 'Confirmation required',
    confirm_delete_message: 'Are you sure you want to delete this entry?',
    confirm_yes: 'Yes',
    confirm_no: 'No',
    table: {
      no_data: 'Nothing to display',
      no_results: 'Nothing found',
      records: 'No records | 1 record | {total} records',
      query: 'Search...',
      columns: {
        id: 'Id',
        created_at: 'Created At',
        updated_at: 'Updated At',
        actions: 'Actions',
        image: 'Image',
      },
    },
    modal: {
      submit: 'Submit',
      cancel: 'Cancel',
      close: 'Close',
    },
    /*
    upload: {
      loading: 'Preparing',
      processing: 'Loading',
      cancel: 'Cancel',
      awaiting_size: 'Awaiting file size',
      sorting_desc: 'You can sort items by drag and drop',
      records: 'No files | 1 file | {total} files',
      max_file_size: 'Maximum file size is {filesize}',
      max_file_size_exceeded: 'File is too large',
    }, */
  },
  errors: {
    error: 'Error',
    access_denied: 'Access Denied',
    http401: 'Error 401: Authorization Required',
    http403: 'Error 403: Access Denied',
    http404: 'Error 404: Not Found',
    http500: 'Error 500: Server Error',
    http0: 'Unknown Error',
  },
}
