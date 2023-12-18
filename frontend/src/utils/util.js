import Cookies from "js-cookie";
import {fetchUserById, fetchUserByToken} from "../services/service";

export async function getCookies() {
    const token = Cookies.get("token");
    const result = token ? await fetchUserByToken(token) : null
    const user = result && result.success ? await fetchUserById(result.userId) : Cookies.remove("token")

    return {user: user, token: token}
}