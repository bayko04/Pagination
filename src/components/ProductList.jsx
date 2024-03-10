import { useState, useEffect } from "react"
import styles from "../css/Product.module.css"
import Pagination from "./Pagination"
import fetchData from "./functions/fetchData"

const ProductList = () => {
    const elemPerPage = 50
    const [ids, setIds] = useState([])
    const [items, setItems] = useState([])
    const [currentPageItems, setCurrentPageItems] = useState(null)
    const [loader, setLoader] = useState(true)
    const [activePage, setActivePage] = useState(1)

    const changePage = (page) => {
        const startInd = (page - 1) * elemPerPage
        const endInd = startInd + elemPerPage
        setActivePage(page)
        setCurrentPageItems(items.slice(startInd, endInd))
    }

    useEffect(() => {
        const fetchDataAndSetState = async () => {
            let resultIds
            try {
                if (ids.length === 0) {
                    const idsResponse = await fetchData("get_ids", {
                        limit: 100,
                    })
                    resultIds = idsResponse.result
                } else {
                    resultIds = ids
                }

                if (resultIds[0] !== "nothing") {
                    const itemsResponse = await fetchData("get_items", {
                        ids: resultIds,
                    })
                    const result = itemsResponse.result

                    const uniqueArray = Array.from(
                        new Set(result.map((item) => item.id))
                    ).map((id) => result.find((item) => item.id === id))

                    setItems(uniqueArray)
                    setCurrentPageItems(uniqueArray.slice(0, 50))
                }
            } catch (error) {
                console.log(error)
            } finally {
                setLoader(false)
            }
        }

        fetchDataAndSetState()
    }, [ids])

    const filter = async (type) => {
        let value
        switch (type) {
            case "product":
                value = prompt("введите название")
                break
            case "price":
                value = +prompt("введите цену")
                break

            case "brand":
                value = prompt("введите бренд")
                break
            default:
                console.log("default")
        }
        try {
            if (value !== null && value !== 0 && value.length !== 0) {
                setLoader(true)
                const { result } = await fetchData("filter", { [type]: value })

                if (result.length === 0) {
                    setItems([])
                    setCurrentPageItems([])
                    setIds(["nothing"])
                } else {
                    setIds(result)
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <>
            <div className={styles.product}>
                <h1>Product List</h1>

                {loader && (
                    <div
                        style={{ textAlign: "center", fontSize: "40px" }}
                        className={styles.loader}
                    >
                        loading...
                    </div>
                )}

                {!loader && (
                    <div className={styles.product__list}>
                        <div className={styles.product__options}>
                            <div className={styles.product__filter}>
                                <button
                                    onClick={() => filter("product")}
                                    className={styles.product__btn}
                                >
                                    title
                                </button>
                                <button
                                    onClick={() => filter("price")}
                                    className={styles.product__btn}
                                >
                                    price
                                </button>
                                <button
                                    onClick={() => filter("brand")}
                                    className={styles.product__btn}
                                >
                                    brand
                                </button>
                            </div>
                            <Pagination
                                data={items}
                                elemPerPage={elemPerPage}
                                changePage={changePage}
                                activePage={activePage}
                            />
                        </div>
                        {!loader && items.length === 0 && (
                            <div style={{ textAlign: "center" }}>
                                <h1>Not Found</h1>
                                <button
                                    onClick={() => {
                                        setIds([])
                                        setLoader(true)
                                    }}
                                >
                                    Вернуться
                                </button>
                            </div>
                        )}
                        {currentPageItems &&
                            currentPageItems.map((item, index) => (
                                <div
                                    className={styles.product__item}
                                    key={index}
                                >
                                    <h3>{item.product}</h3>
                                    <p>price: {item.price}</p>
                                    <p>brand: {item.brand}</p>
                                    <p>id: {item.id}</p>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </>
    )
}

export default ProductList
