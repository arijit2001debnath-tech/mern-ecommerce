import Chart from "react-apexcharts";
import { useGetUsersQuery } from "../../redux/api/usersApiSlice";
import {
    useGetTotalOrdersQuery,
    useGetTotalSalesByDateQuery,
    useGetTotalSalesQuery,
} from "../../redux/api/orderApiSlice";
import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import OrderList from "./OrderList";
import Loader from "../../components/Loader";

const AdminDashboard = () => {
    const { data: sales, isLoading } = useGetTotalSalesQuery();
    const { data: customers } = useGetUsersQuery();
    const { data: orders } = useGetTotalOrdersQuery();
    const { data: salesDetail } = useGetTotalSalesByDateQuery();

    const [state, setState] = useState({
        options: {
            chart: {
                type: "bar",
                foreColor: "#E5E7EB", // Makes text/labels visible on dark bg
                toolbar: {
                    show: true,
                    tools: {
                        download: true,
                        selection: true,
                        zoom: true,
                        zoomin: true,
                        zoomout: true,
                        pan: true,
                        reset: true,
                    },
                },
            },
            tooltip: { theme: "dark" },
            colors: ["#00E396"], // green accent
            dataLabels: { enabled: true, style: { colors: ["#E5E7EB"] } },
            stroke: { curve: "smooth" },
            title: {
                text: "Sales Trend",
                align: "left",
                style: { color: "#F9FAFB" },
            },
            grid: { borderColor: "#333" },
            markers: { size: 1 },
            xaxis: {
                categories: [],
                title: { text: "Date", style: { color: "#E5E7EB" } },
                labels: { style: { colors: "#E5E7EB" } },
            },
            yaxis: {
                title: { text: "Sales ($)", style: { color: "#E5E7EB" } },
                labels: { style: { colors: "#E5E7EB" } },
                min: 0,
            },
            legend: {
                position: "top",
                horizontalAlign: "right",
                labels: { colors: "#E5E7EB" },
            },
        },
        series: [{ name: "Sales", data: [] }],
    });

    useEffect(() => {
        if (salesDetail) {
            const formatted = salesDetail.map((item) => ({
                x: item._id,
                y: item.totalSales,
            }));

            setState((prev) => ({
                ...prev,
                options: {
                    ...prev.options,
                    xaxis: { categories: formatted.map((i) => i.x) },
                },
                series: [{ name: "Sales", data: formatted.map((i) => i.y) }],
            }));
        }
    }, [salesDetail]);

    return (
        <>
            <AdminMenu />
            <section className="min-h-screen bg-[#0b0b0b] text-gray-100 xl:ml-[4rem] md:ml-0 p-8">
                {/* Top Summary Cards */}
                <div className="w-[90%] flex justify-around flex-wrap mx-auto">
                    {[
                        {
                            label: "Sales",
                            value: isLoading ? <Loader /> : `$ ${sales?.totalSales?.toFixed(2)}`,
                        },
                        {
                            label: "Customers",
                            value: customers ? customers.length : <Loader />,
                        },
                        {
                            label: "All Orders",
                            value: orders ? orders.totalOrders : <Loader />,
                        },
                    ].map((item, i) => (
                        <div
                            key={i}
                            className="rounded-2xl bg-[#181818] shadow-lg shadow-black/40 p-6 w-[18rem] mt-6 text-center"
                        >
                            <div className="mx-auto font-bold rounded-full w-[3rem] h-[3rem] flex items-center justify-center bg-pink-500 text-white">
                                $
                            </div>
                            <p className="mt-4 text-gray-400">{item.label}</p>
                            <h1 className="text-2xl font-bold mt-2 text-white">{item.value}</h1>
                        </div>
                    ))}
                </div>

                {/* Chart Section */}
                <div className="flex justify-center mt-16">
                    <div className="bg-[#181818] p-8 rounded-2xl shadow-md shadow-black/40 w-[80%]">
                        <Chart
                            options={state.options}
                            series={state.series}
                            type="bar"
                            width="100%"
                            height="350"
                        />
                    </div>
                </div>

                {/* Orders List */}
                <div className="mt-16 bg-[#181818] p-8 rounded-2xl shadow-md shadow-black/40 w-[90%] mx-auto">
                    <OrderList />
                </div>
            </section>
        </>
    );
};

export default AdminDashboard;
