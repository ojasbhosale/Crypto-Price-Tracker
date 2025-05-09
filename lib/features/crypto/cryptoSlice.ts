import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"

// Define types for our state
interface CryptoData {
  id: string
  name: string
  symbol: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  total_volume: number
  price_change_percentage_24h: number
  price_change_percentage_1h_in_currency: number
  price_change_percentage_7d_in_currency: number
  circulating_supply: number
  max_supply: number | null
  sparkline_in_7d: {
    price: number[]
  }
  [key: string]: string | number | boolean | null | { price: number[] } | undefined
}

interface CryptoState {
  cryptos: CryptoData[]
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

const initialState: CryptoState = {
  cryptos: [],
  status: "idle",
  error: null,
}

// Fetch crypto data from CoinGecko API
export const fetchCryptoData = createAsyncThunk("crypto/fetchCryptoData", async () => {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true&price_change_percentage=1h,24h,7d",
    )

    if (!response.ok) {
      throw new Error("API rate limit exceeded. Please try again later.")
    }

    const data = await response.json()
    return data
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message)
    }
    throw new Error("Failed to fetch crypto data")
  }
})

// Create the crypto slice
const cryptoSlice = createSlice({
  name: "crypto",
  initialState,
  reducers: {
    updateCryptoPrices: (state) => {
      // Simulate WebSocket updates by randomly changing prices
      state.cryptos = state.cryptos.map((crypto) => {
        // Generate random percentage change between -2% and 2%
        const priceChangePercent = (Math.random() * 4 - 2) / 100

        // Calculate new price
        const newPrice = crypto.current_price * (1 + priceChangePercent)

        // Update 1h, 24h, and 7d percentages with small random changes
        const hourChange = crypto.price_change_percentage_1h_in_currency + (Math.random() * 0.4 - 0.2)
        const dayChange = crypto.price_change_percentage_24h + (Math.random() * 0.4 - 0.2)
        const weekChange = crypto.price_change_percentage_7d_in_currency + (Math.random() * 0.4 - 0.2)

        // Update volume with random change
        const volumeChange = Math.random() * 0.06 - 0.03 // -3% to +3%
        const newVolume = crypto.total_volume * (1 + volumeChange)

        // Update sparkline data by adding the new price and removing the oldest
        const newSparklineData = [...crypto.sparkline_in_7d.price.slice(1), newPrice]

        return {
          ...crypto,
          current_price: newPrice,
          price_change_percentage_1h_in_currency: hourChange,
          price_change_percentage_24h: dayChange,
          price_change_percentage_7d_in_currency: weekChange,
          total_volume: newVolume,
          sparkline_in_7d: {
            price: newSparklineData,
          },
        }
      })
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCryptoData.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchCryptoData.fulfilled, (state, action: PayloadAction<CryptoData[]>) => {
        state.status = "succeeded"
        state.cryptos = action.payload
        state.error = null
      })
      .addCase(fetchCryptoData.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to fetch data"
      })
  },
})

export const { updateCryptoPrices } = cryptoSlice.actions
export default cryptoSlice.reducer
