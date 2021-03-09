<script>
import Create from '~/pages/index/create'
import {url} from '~/pages/index'

export default {
  name: 'EditPage',
  extends: Create,
  validate({params}) {
    return /^\d+$/.test(params.id)
  },
  async asyncData({app, params, error}) {
    try {
      const {data: record} = await app.$axios.get(url + '/' + params.id)
      return {record}
    } catch (e) {
      error({statusCode: e.statusCode, message: e.data})
    }
  },
  data() {
    return {
      url: url + '/' + this.$route.params.id,
      record: {},
    }
  },
}
</script>
