
export default function ProductRow({ product }) {
    return (
        <tr className={"table-tr"}>
            <td>{product.name}</td>
            <td>{product.sku}</td>
            <td>{product.category}</td>
            <td>{product.price.toLocaleString("vi-VN")} đ</td>
            <td>{product.stock}</td>
            <td>{product.status}</td>
            <td>
                <div className={"action-btns"}>
                    <button className={"btn-fix"}>Sửa</button>
                    <button className={"btn-delete"}>Xóa</button>
                </div>
            </td>
        </tr>
    );
}
