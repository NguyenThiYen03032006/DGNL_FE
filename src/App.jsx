// HOAN_THIEN: dựng bố cục trang và khai báo các route theo đề (Mục 4.1, 4.2, 4.3).
// Xoá đoạn return bên dưới khi bắt đầu làm bài.
import ProductTable from "./components/ProductTable.jsx";
export default function App() {
    return (
        <div className="App">
            <div className="header">
                <h1>OfficeMart Admin</h1>
            </div>
            <div className="content">
                <div className="container">
                    <b>Sản Phẩm</b>
                    <button className="btn-add">
                        Thêm Sản Phẩm
                    </button>
                </div>
                <div>
                    <ProductTable />
                </div>
            </div>
        </div>
    );
}
