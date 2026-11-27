import ProductRow from "./ProductRow.jsx";
import sampleProducts from "../data/sample.js";

export default function ProductTable({ products = [] }) {
    return (
        <table className="product-table">
            <thead>
            <tr>
                <th>Tên</th>
                <th>SKU</th>
                <th>Danh mục</th>
                <th>Giá</th>
                <th>Tồn kho</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
            </tr>
            </thead>
            <tbody>
            {sampleProducts.map((item) => (
                <ProductRow
                    key={item.id}
                    product={item}
                />
            ))}
            </tbody>
        </table>
    )
}