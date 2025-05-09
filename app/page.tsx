import CryptoTable from "@/components/crypto-table";
import { Providers } from "@/components/providers";


export default function Home() {
  return (
    <Providers>
      <main className="min-h-screen p-4 md:p-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Crypto Price Tracker</h1>
              <p className="text-muted-foreground">Real-time cryptocurrency prices and market data</p>
            </div>
           
          </header>

          <CryptoTable />
        </div>
      </main>
    </Providers>
  );
}
