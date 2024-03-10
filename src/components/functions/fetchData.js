import { MD5 } from "crypto-js"

const API = "http://api.valantis.store:40000/"
const API_PASSWORD = "Valantis"
const timeStamp = new Date().toISOString().slice(0, 10).replace(/-/g, "")
const authString = `${API_PASSWORD}_${timeStamp}`
const hashedAuth = MD5(authString).toString()

const fetchData = async (action, params) => {
    try {
        const response = await fetch(API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Auth": hashedAuth,
            },
            body: JSON.stringify({
                action,
                params,
            }),
        })

        return response.json()
    } catch (error) {
        console.log(error)
    }
}

export default fetchData
