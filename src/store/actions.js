import { getUser } from '../api/getData'
import { GET_USERINFO } from './mutation_types'

export default {
  async getUserInfo ({ state, commit }) {
    let res = await getUser()
    commit(GET_USERINFO, res)
  }
}
