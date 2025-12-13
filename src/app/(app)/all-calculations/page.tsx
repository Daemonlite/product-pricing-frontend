"use client";

import React, { useState, useEffect } from "react";
import {
  Download,
  Grid3X3,
  Zap,
  Headphones,
  Monitor,
  Tablet,
  Package,
  RefreshCw,
  Eye,
  ChevronDown,
  ChevronRight,
  Truck,
  PackageCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table } from "@/components/ui/table";
import DatePicker from "@/components/ui/date-picker";
import { Dialog } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getAllPricings } from "@/store/slices/pricingSlice";
import { fetchCategories } from "@/store/slices/categoriesSlice";
import { useAuth } from "@/hooks/useAuth";

type Product = {
  id: number;
  uid: string;
  name: string;
  category: {
    id: number;
    uid: string;
    name: string;
  };
  profit: number;
  stock: number;
  cost_price: string;
  selling_price: string;
  sku: string | null;
  created_at: string;
  updated_at: string;
};

type Shipping = {
  id: number;
  uid: string;
  name: string;
};

type PricingCalculation = {
  id: number;
  uid: string;
  products: Product[];
  shipping: Shipping;
  shipping_cost: string;
  import_tax: string;
  other_cost_type: "percentage" | "fixed";
  other_costs: string;
  total_cost: string;
  created_at: string;
  updated_at: string;
};

const AllCalculations: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { pricings, loading, error } = useAppSelector((state) => state.pricing);
  const { categories: storeCategories } = useAppSelector(
    (state) => state.categories
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof TableRow>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCalculation, setSelectedCalculation] =
    useState<PricingCalculation | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (user?.token) {
      dispatch(getAllPricings(user.token));
      dispatch(fetchCategories(user.token));
    }
  }, [dispatch, user?.token]);

  // Type for the table row
  type TableRow = {
    id: number;
    uid: string;
    shipping_name: string;
    products_count: number;
    import_tax: string;
    shipping_cost: string;
    other_costs: string; // Change from number to string
    other_cost_type: "percentage" | "fixed";
    total_cost: string;
    created_at: string;
    created_at_date: Date | null;
    calculation: PricingCalculation;
  };

  const columns: {
    key: keyof TableRow;
    label: string;
    sortable?: boolean;
    format?: (value: any) => string;
  }[] = [
    { key: "shipping_name", label: "Shipping Name", sortable: true },
    { key: "products_count", label: "Total Products", sortable: true },
    {
      key: "import_tax",
      label: "Import Tax",
      sortable: true,
      format: (value: string) =>
        `₵${parseFloat(value).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
    },
    {
      key: "shipping_cost",
      label: "Shipping Cost",
      sortable: true,
      format: (value: string) =>
        `₵${parseFloat(value).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
    },
    {
      key: "other_costs",
      label: "Other Costs",
      sortable: true,
      format: (value: string) =>
        `₵${parseFloat(value).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
    },
    {
      key: "total_cost",
      label: "Total Cost",
      sortable: true,
      format: (value: string) =>
        `₵${parseFloat(value).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
    },
  ];

  const handleViewDetails = (item: TableRow) => {
    setSelectedCalculation(item.calculation);
    console.log(`item.calculation`, item.calculation);
    setIsDialogOpen(true);
  };

  const toggleRowExpansion = (id: number) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(id)) {
      newExpandedRows.delete(id);
    } else {
      newExpandedRows.add(id);
    }
    setExpandedRows(newExpandedRows);
  };

  const formatOtherCost = (value: string, costType: "percentage" | "fixed") => {
    if (costType === "percentage") {
      return `${value}%`;
    } else {
      // Parse the string to number for formatting
      const numericValue = parseFloat(value);
      return `₵${numericValue.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }
  };

  const actions = (item: TableRow, index: number) => (
    <div className="flex space-x-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => toggleRowExpansion(item.id)}
        className="h-8 w-8 p-0"
      >
        {expandedRows.has(item.id) ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </Button>
      <Button variant="ghost" size="sm" onClick={() => handleViewDetails(item)}>
        <Eye className="h-4 w-4" />
      </Button>
    </div>
  );

  const onSort = (key: keyof TableRow) => {
    if (key === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(key);
      setSortDirection("asc");
    }
  };

  // Transform API data to calculations
  const calculations: PricingCalculation[] =
    pricings && pricings.length > 0
      ? pricings.map((pricing: any) => ({
          id: pricing.id,
          uid: pricing.uid,
          products: pricing.products || [],
          shipping: pricing.shipping || { id: 0, uid: "", name: "Unknown" },
          shipping_cost: pricing.shipping_cost || "0.00",
          import_tax: pricing.import_tax || "0.00",
          other_cost_type: pricing.other_cost_type || "fixed",
          other_costs: pricing.other_costs || 0,
          total_cost: pricing.total_cost || "0.00",
          created_at: pricing.created_at,
          updated_at: pricing.updated_at,
        }))
      : [];

  // Transform for table display
  const tableData: TableRow[] = calculations.map((calculation) => {
    const createdDate = calculation.created_at
      ? new Date(calculation.created_at)
      : null;
    return {
      id: calculation.id,
      uid: calculation.uid,
      shipping_name: calculation.shipping?.name || "Unknown",
      products_count: calculation.products.length,
      other_cost_type: calculation.other_cost_type,
      import_tax: calculation.import_tax,
      shipping_cost: calculation.shipping_cost,
      total_cost: calculation.total_cost,
      other_costs: calculation.other_costs, // This is a string from API
      created_at: createdDate
        ? createdDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "N/A",
      created_at_date: createdDate,
      calculation: calculation,
    };
  });

  // Get categories from products
  const uniqueCategories = Array.from(
    new Set(
      calculations.flatMap((calculation) =>
        calculation.products
          .map((product) => product.category?.name)
          .filter(Boolean)
      )
    )
  );
  const storeCategoryNames = storeCategories.map((cat) => cat.name);
  const categories = [
    "All",
    ...(storeCategoryNames.length > 0 ? storeCategoryNames : uniqueCategories),
  ];

  const categoryIcons = {
    All: Grid3X3,
    Electronics: Zap,
    Audio: Headphones,
    Computers: Monitor,
    Tablets: Tablet,
    Accessories: Package,
  };

  // Filter calculations by category
  const filteredCalculations = tableData
    .filter((row) => {
      if (selectedCategory === "All") return true;
      return row.calculation.products.some(
        (product) => product.category?.name === selectedCategory
      );
    })
    .filter((row) => {
      if (!dateRange[0] || !dateRange[1]) return true;
      if (!row.created_at_date) return false;
      return (
        row.created_at_date >= dateRange[0] &&
        row.created_at_date <= dateRange[1]
      );
    });

  return (
    <div className="space-y-6">
      <div
        className="flex items-center justify-between"
        style={{ animation: `fadeInUp 0.6s ease-out 0s both` }}
      >
        <div>
          <h1 className="text-2xl font-bold">All Pricing Calculations</h1>
          <p className="text-sm text-muted-foreground">
            View and analyze all pricing calculations performed in the system
          </p>
        </div>
        {/* <div className="flex items-center space-x-2">
          <DatePicker 
            id='date' 
            mode='range' 
            placeholder='Select Date' 
            onChange={(dates) => setDateRange(dates as [Date | null, Date | null])} 
          />
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => user?.token && dispatch(getAllPricings(user.token))}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div> */}
      </div>

      {/* Category Filter */}
      <div
        className="overflow-hidden rounded-lg bg-card"
        style={{ animation: `fadeInUp 0.6s ease-out 0.1s both` }}
      >
        <div className="px-6 py-6">
          <div className="flex items-center gap-1 scroll-auto overflow-x-auto w-full no-scrollbar max-w-6xl mx-auto">
            {loading ? (
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} className="h-8 w-24" />
                ))}
              </div>
            ) : (
              categories.map((category, index) => {
                const Icon =
                  categoryIcons[category as keyof typeof categoryIcons] ||
                  Grid3X3;
                return (
                  <button
                    key={category}
                    style={{
                      animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                    }}
                    onClick={() => setSelectedCategory(category)}
                    className={`flex text-nowrap items-center text-base font-medium cursor-pointer rounded px-6 py-1 transition duration-300 ${
                      selectedCategory === category
                        ? "text-white bg-primary"
                        : "text-foreground hover:text-primary"
                    }`}
                  >
                    <Icon className="mr-1 h-4 w-4" />
                    {category}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div
        className="overflow-hidden rounded-lg bg-card border"
        style={{ animation: `fadeInUp 0.6s ease-out 0.2s both` }}
      >
        {loading ? (
          <div className="space-y-4 p-6">
            <Skeleton className="h-10 w-full rounded-lg" />
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-nowrap">
              <thead>
                <tr className="border-b bg-muted/50">
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    >
                      {column.label}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCalculations.map((row, index) => (
                  <React.Fragment key={row.id}>
                    <tr
                      className={`border-b hover:bg-muted/50 ${
                        index % 2 === 0 ? "bg-card" : "bg-muted/20"
                      }`}
                      style={{
                        animation: `fadeInUp 0.6s ease-out ${
                          index * 0.1
                        }s both`,
                      }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Truck className="h-4 w-4 mr-2 text-muted-foreground" />
                          {row.shipping_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {row.products_count}
                      </td>
                      <td className="px-6 py-4">
                        {columns
                          .find((c) => c.key === "import_tax")
                          ?.format?.(row.import_tax) || row.import_tax}
                      </td>
                      <td className="px-6 py-4">
                        {columns
                          .find((c) => c.key === "shipping_cost")
                          ?.format?.(row.shipping_cost) || row.shipping_cost}
                      </td>
                      <td className="px-6 py-4">
                        {/* {columns.find(c => c.key === 'other_costs')?.format?.(row.other_costs) || row.other_costs} */}
                        {formatOtherCost(row.other_costs, row.other_cost_type)}
                      </td>
                      <td className="px-6 py-4 font-semibold">
                        {columns
                          .find((c) => c.key === "total_cost")
                          ?.format?.(row.total_cost) || row.total_cost}
                      </td>
                      <td className="px-6 py-4">{actions(row, index)}</td>
                    </tr>

                    {/* Expanded Row with Products */}
                    {expandedRows.has(row.id) && (
                      <tr className="bg-muted/10">
                        <td colSpan={6} className="px-6 py-4">
                          <div className="space-y-4 pl-4 border-l-2 border-primary/20">
                            <div className="bg-card rounded-lg p-4 border">
                              <div className="flex items-center mb-4">
                                <PackageCheck className="h-5 w-5 mr-2 text-primary" />
                                <h3 className="font-semibold">
                                  Products in Calculation ({row.products_count})
                                </h3>
                              </div>
                              <div className="overflow-x-auto">
                                <table className="w-full text-sm text-nowrap">
                                  <thead className="bg-muted/30">
                                    <tr>
                                      <th className="px-4 py-2 text-left">
                                        Product Name
                                      </th>
                                      <th className="px-4 py-2 text-left">
                                        Category
                                      </th>
                                      <th className="px-4 py-2 text-left">
                                        Cost Price
                                      </th>
                                      <th className="px-4 py-2 text-left">
                                        Selling Price
                                      </th>
                                      <th className="px-4 py-2 text-left">
                                        Profit
                                      </th>
                                      <th className="px-4 py-2 text-left">
                                        Stock
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {row.calculation.products.map(
                                      (product, idx) => (
                                        <tr
                                          key={product.id}
                                          className={
                                            idx % 2 === 0
                                              ? "bg-card"
                                              : "bg-muted/10"
                                          }
                                        >
                                          <td className="px-4 py-2 font-medium">
                                            {product.name}
                                          </td>
                                          <td className="px-4 py-2">
                                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                                              {product.category?.name ||
                                                "Unknown"}
                                            </span>
                                          </td>
                                          <td className="px-4 py-2">
                                            ₵
                                            {parseFloat(
                                              product.cost_price
                                            ).toLocaleString("en-US", {
                                              minimumFractionDigits: 2,
                                              maximumFractionDigits: 2,
                                            })}
                                          </td>
                                          <td className="px-4 py-2">
                                            ₵
                                            {parseFloat(
                                              product.selling_price
                                            ).toLocaleString("en-US", {
                                              minimumFractionDigits: 2,
                                              maximumFractionDigits: 2,
                                            })}
                                          </td>
                                          <td className="px-4 py-2 font-medium text-green-600">
                                            ₵
                                            {product.profit.toLocaleString(
                                              "en-US",
                                              {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                              }
                                            )}
                                          </td>
                                          <td className="px-4 py-2">
                                            {product.stock}
                                          </td>
                                        </tr>
                                      )
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}

                {filteredCalculations.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="text-center py-8">
                        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">
                          No calculations found
                        </h3>
                        <p className="text-muted-foreground">
                          {selectedCategory !== "All"
                            ? `No calculations found for category "${selectedCategory}"`
                            : "No pricing calculations available"}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Margin Summary (Keep original) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {loading ? (
          <>
            <div
              className="overflow-hidden rounded-lg bg-card"
              style={{ animation: `fadeInUp 0.6s ease-out 0.3s both` }}
            >
              <div className="border-b border-border bg-muted px-6 py-4">
                <Skeleton className="h-6 w-32" />
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-5 w-40" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-5 w-40" />
                  </div>
                </div>
              </div>
            </div>
            <div
              className="overflow-hidden rounded-lg bg-card"
              style={{ animation: `fadeInUp 0.6s ease-out 0.4s both` }}
            >
              <div className="border-b border-border bg-muted px-6 py-4">
                <Skeleton className="h-6 w-40" />
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <Skeleton className="h-2 w-full mt-2" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div
              className="overflow-hidden rounded-lg bg-card"
              style={{ animation: `fadeInUp 0.6s ease-out 0.5s both` }}
            >
              <div className="border-b border-border bg-muted px-6 py-4">
                <Skeleton className="h-6 w-36" />
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border border-border p-4"
                    >
                      <div>
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-4 w-20 mt-1" />
                      </div>
                      <div className="text-right">
                        <Skeleton className="h-6 w-12" />
                        <Skeleton className="h-4 w-16 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div
              className="overflow-hidden rounded-lg bg-card"
              style={{ animation: `fadeInUp 0.6s ease-out 0.3s both` }}
            >
              <div className="border-b border-border bg-muted px-6 py-4">
                <h2 className="text-lg font-medium">Margin Summary</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {calculations.length > 0 ? (
                    <>
                      <div>
                        <p className="text-sm font-medium">
                          Total Calculations
                        </p>
                        <p className="text-3xl font-semibold">
                          {calculations.length}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Total Products</p>
                        <p className="text-lg font-medium">
                          {calculations.reduce(
                            (sum, calc) => sum + calc.products.length,
                            0
                          )}{" "}
                          items
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Total Cost</p>
                        <p className="text-lg font-medium">
                          ₵
                          {calculations
                            .reduce(
                              (sum, calc) => sum + parseFloat(calc.total_cost),
                              0
                            )
                            .toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <p>No pricing data available</p>
                      <p className="text-sm">
                        Perform some pricing calculations to see analytics
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Margin Distribution */}
            <div
              className="overflow-hidden rounded-lg bg-card"
              style={{ animation: `fadeInUp 0.6s ease-out 0.4s both` }}
            >
              <div className="border-b border-border bg-muted px-6 py-4">
                <h2 className="text-lg font-medium">Product Distribution</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {(() => {
                    const allProducts = calculations.flatMap(
                      (calc) => calc.products
                    );
                    const categories = ["Electronics", "Audio", "Other"];
                    return categories.map((category, index) => {
                      const count = allProducts.filter((p) => {
                        if (category === "Electronics")
                          return p.category?.name === "Electronics";
                        if (category === "Audio")
                          return p.category?.name === "Audio";
                        return (
                          p.category?.name !== "Electronics" &&
                          p.category?.name !== "Audio"
                        );
                      }).length;
                      const colors = [
                        "bg-blue-500",
                        "bg-green-500",
                        "bg-purple-500",
                      ];
                      return (
                        <div
                          key={index}
                          style={{
                            animation: `fadeInUp 0.6s ease-out ${
                              (index + 3) * 0.1
                            }s both`,
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              {category}
                            </span>
                            <span className="text-sm font-medium">
                              {count} products
                            </span>
                          </div>
                          <div className="mt-2 h-2 w-full rounded-full bg-muted">
                            <div
                              className={`h-2 rounded-full ${colors[index]}`}
                              style={{
                                width: `${
                                  (count / (allProducts.length || 1)) * 100
                                }%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>

            {/* Shipping Cost Analysis */}
            <div
              className="overflow-hidden rounded-lg bg-card"
              style={{ animation: `fadeInUp 0.6s ease-out 0.5s both` }}
            >
              <div className="border-b border-border bg-muted px-6 py-4">
                <h2 className="text-lg font-medium">Shipping Cost Analysis</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Average Shipping Cost</p>
                    <p className="text-lg font-medium">
                      ₵{" "}
                      {calculations.length > 0
                        ? (
                            calculations.reduce(
                              (sum, calc) =>
                                sum + parseFloat(calc.shipping_cost),
                              0
                            ) / calculations.length
                          ).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        : "0.00"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Average Import Tax</p>
                    <p className="text-lg font-medium">
                      ₵{" "}
                      {calculations.length > 0
                        ? (
                            calculations.reduce(
                              (sum, calc) => sum + parseFloat(calc.import_tax),
                              0
                            ) / calculations.length
                          ).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        : "0.00"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Dialog for Detailed View */}
      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Calculation Details"
        size="4xl"
      >
        {selectedCalculation && (
          <div className="space-y-6 text-nowrap">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    Shipping Name
                  </h4>
                  <div className="flex items-center">
                    <Truck className="h-4 w-4 mr-2" />
                    <p className="text-lg font-semibold">
                      {selectedCalculation.shipping.name}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    Total Products
                  </h4>
                  <p className="text-lg font-semibold">
                    {selectedCalculation.products.length}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    Calculation Date
                  </h4>
                  <p className="text-lg">
                    {new Date(
                      selectedCalculation.created_at
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              <div className="space-y-4 bg-muted/20 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Cost Breakdown</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Import Tax:</span>
                    <span className="font-medium">
                      ₵
                      {parseFloat(
                        selectedCalculation.import_tax
                      ).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping Cost:</span>
                    <span className="font-medium">
                      ₵
                      {parseFloat(
                        selectedCalculation.shipping_cost
                      ).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Other Costs:</span>
                    <span className="font-medium">
                      {/* ₵{selectedCalculation.other_costs.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} */}
                      {formatOtherCost(
                        selectedCalculation.other_costs,
                        selectedCalculation.other_cost_type
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t font-semibold text-lg">
                    <span>Total Cost:</span>
                    <span>
                      ₵
                      {parseFloat(
                        selectedCalculation.total_cost
                      ).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">
                Products ({selectedCalculation.products.length})
              </h4>
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase">
                        Product Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase">
                        Category
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase">
                        SKU
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase">
                        Cost Price
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase">
                        Selling Price
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase">
                        Profit
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase">
                        Stock
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCalculation.products.map((product, index) => (
                      <tr
                        key={product.id}
                        className={index % 2 === 0 ? "bg-card" : "bg-muted/10"}
                      >
                        <td className="px-4 py-3 font-medium">
                          {product.name}
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                            {product.category?.name || "Unknown"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {product.sku || (
                            <span className="text-muted-foreground text-sm">
                              N/A
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          ₵
                          {parseFloat(product.cost_price).toLocaleString(
                            "en-US",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </td>
                        <td className="px-4 py-3">
                          ₵
                          {parseFloat(product.selling_price).toLocaleString(
                            "en-US",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </td>
                        <td className="px-4 py-3 font-medium text-green-600">
                          ₵{" "}
                          {product.profit.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="px-4 py-3">{product.stock}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default AllCalculations;
