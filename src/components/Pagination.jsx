import { useEffect, useState } from "react"
import styles from "../css/Product.module.css"

const Pagination = ({ data, elemPerPage, changePage, activePage }) => {
    const totalPage = Math.ceil(data && data.length / elemPerPage)
    const arrayOfPage = Array.from(
        { length: totalPage },
        (_, index) => index + 1
    )
    const [start, setStart] = useState(0)
    const paginationPerPage = arrayOfPage.slice(start, start + 7)

    useEffect(() => {
        if (activePage === start + 8 && start < totalPage) {
            setStart((prev) => prev + 1)
        }

        if (activePage < start + 1 && start > 0) {
            setStart((prev) => prev - 1)
        }
    }, [activePage])

    const nextPrevPage = (type) => {
        if (activePage < totalPage && type === "next") {
            changePage(activePage + 1)
        }
        if (activePage > 1 && type === "prev") {
            changePage(activePage - 1)
        }
    }

    return (
        <div className={styles.pagination}>
            <ul
                className={styles.pagination__list}
                style={{ display: "flex", justifyContent: "center" }}
            >
                <button
                    onClick={() => {
                        nextPrevPage("prev")
                    }}
                >
                    {"<"}
                </button>
                {paginationPerPage.map((page) => (
                    <li
                        className={
                            activePage === page ? styles.pagination__active : ""
                        }
                        key={page}
                        onClick={() => changePage(page)}
                    >
                        {page}
                    </li>
                ))}
                <button
                    onClick={() => {
                        nextPrevPage("next")
                    }}
                >
                    {">"}
                </button>
            </ul>
        </div>
    )
}

export default Pagination
