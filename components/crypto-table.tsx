"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowUpDown, ChevronDown, ChevronUp, RefreshCw, Search } from "lucide-react"
import { fetchCryptoData, updateCryptoPrices } from "@/lib/features/crypto/cryptoSlice"
import type { AppDispatch, RootState } from "@/lib/store"
import { PriceChart } from "@/components/price-chart"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"

export default function CryptoTable() {
  const dispatch = useDispatch<AppDispatch>()
  const { cryptos, status, error } = useSelector((state: RootState) => state.crypto)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "ascending" | "descending" }>({
    key: "market_cap_rank",
    direction: "ascending",
  })
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    dispatch(fetchCryptoData())

    // Simulate WebSocket updates
    const interval = setInterval(() => {
      dispatch(updateCryptoPrices())
    }, 2000)

    return () => clearInterval(interval)
  }, [dispatch])

  const handleSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending"

    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }

    setSortConfig({ key, direction })
  }

  const sortedCryptos = [...cryptos].sort((a, b) => {
    // Handle cases where the property might be undefined or null
    const valueA = a[sortConfig.key] ?? 0
    const valueB = b[sortConfig.key] ?? 0

    if (valueA < valueB) {
      return sortConfig.direction === "ascending" ? -1 : 1
    }
    if (valueA > valueB) {
      return sortConfig.direction === "ascending" ? 1 : -1
    }
    return 0
  })

  const filteredCryptos = sortedCryptos.filter(
    (crypto) =>
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const formatNumber = (num: number, maximumFractionDigits = 2) => {
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits,
    }).format(num)
  }

  const formatCurrency = (num: number, maximumFractionDigits = 2) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits,
    }).format(num)
  }

  const formatLargeNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
    return formatCurrency(num)
  }

  const renderPercentageChange = (value: number) => {
    const color = value >= 0 ? "text-green-500" : "text-red-500"
    const icon = value >= 0 ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />

    return (
      <span className={`flex items-center ${color}`}>
        {icon}
        {Math.abs(value).toFixed(2)}%
      </span>
    )
  }

  if (status === "loading" && cryptos.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between">
            <span>Cryptocurrency Market</span>
            <RefreshCw className="h-5 w-5 animate-spin" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (status === "failed") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error Loading Data</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
          <Button className="mt-4" onClick={() => dispatch(fetchCryptoData())}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <CardTitle className="flex items-center">
            Cryptocurrency Market
            {status === "loading" && <RefreshCw className="ml-2 h-4 w-4 animate-spin" />}
          </CardTitle>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search coins..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]" onClick={() => handleSort("market_cap_rank")}>
                  <div className="flex items-center cursor-pointer">
                    #
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right" onClick={() => handleSort("current_price")}>
                  <div className="flex items-center justify-end cursor-pointer">
                    Price
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="text-right" onClick={() => handleSort("price_change_percentage_1h_in_currency")}>
                  <div className="flex items-center justify-end cursor-pointer">
                    1h %
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="text-right" onClick={() => handleSort("price_change_percentage_24h")}>
                  <div className="flex items-center justify-end cursor-pointer">
                    24h %
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="text-right" onClick={() => handleSort("price_change_percentage_7d_in_currency")}>
                  <div className="flex items-center justify-end cursor-pointer">
                    7d %
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="text-right" onClick={() => handleSort("market_cap")}>
                  <div className="flex items-center justify-end cursor-pointer">
                    Market Cap
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="text-right" onClick={() => handleSort("total_volume")}>
                  <div className="flex items-center justify-end cursor-pointer">
                    24h Volume
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="text-right">Circulating Supply</TableHead>
                <TableHead className="text-right">Max Supply</TableHead>
                <TableHead className="text-right">7D Chart</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCryptos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-8">
                    No cryptocurrencies found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCryptos.map((crypto) => (
                  <TableRow key={crypto.id}>
                    <TableCell>{crypto.market_cap_rank}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Image
                          src={crypto.image || "/placeholder.svg"}
                          alt={crypto.name}
                          width={24}
                          height={24}
                          className="w-6 h-6"
                        />
                        <div>
                          <div className="font-medium">{crypto.name}</div>
                          <div className="text-xs text-muted-foreground uppercase">{crypto.symbol}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(crypto.current_price)}</TableCell>
                    <TableCell className="text-right">
                      {renderPercentageChange(crypto.price_change_percentage_1h_in_currency)}
                    </TableCell>
                    <TableCell className="text-right">
                      {renderPercentageChange(crypto.price_change_percentage_24h)}
                    </TableCell>
                    <TableCell className="text-right">
                      {renderPercentageChange(crypto.price_change_percentage_7d_in_currency)}
                    </TableCell>
                    <TableCell className="text-right">{formatLargeNumber(crypto.market_cap)}</TableCell>
                    <TableCell className="text-right">{formatLargeNumber(crypto.total_volume)}</TableCell>
                    <TableCell className="text-right">
                      {formatNumber(crypto.circulating_supply)} {crypto.symbol.toUpperCase()}
                    </TableCell>
                    <TableCell className="text-right">
                      {crypto.max_supply ? (
                        `${formatNumber(crypto.max_supply)} ${crypto.symbol.toUpperCase()}`
                      ) : (
                        <span className="text-muted-foreground">∞</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="h-12 w-32 ml-auto">
                        <PriceChart
                          data={crypto.sparkline_in_7d.price}
                          color={crypto.price_change_percentage_7d_in_currency >= 0 ? "#10b981" : "#ef4444"}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
