import { useState, useEffect } from "react";

export default function App() {
	const [amount, setAmount] = useState(1);
	const [inputCurrency, setInputCurrency] = useState("EUR");
	const [outputCurrency, setOutputCurrency] = useState("USD");
	const [exchangeRate, setExchangeRate] = useState(1);
	const [isLoading, setIsLoading] = useState(false);

	const handleChange = (e) => {
		const value = e.target.value;
		if (isFinite(value)) setAmount(+value);
	};

	useEffect(() => {
		if (inputCurrency === outputCurrency) {
			setExchangeRate(1);
			return;
		}
		const controller = new AbortController();
		// getting exchange rates from api
		(async () => {
			try {
				setIsLoading(true);
				const response = await fetch(
					`https://api.frankfurter.app/latest?amount=1&from=${inputCurrency}&to=${outputCurrency}`,
					{ signal: controller.signal }
				);
				const data = await response.json();
				setExchangeRate(data.rates[outputCurrency]);
			} catch (err) {
				if (err.name !== "AbortError") {
					console.log("Error : ", err);
				}
			} finally {
				setIsLoading(false);
			}
		})();

		return () => {
			controller.abort();
		};
	}, [inputCurrency, outputCurrency]);

	return (
		<div>
			<input
				type="text"
				value={amount}
				onChange={handleChange}
				disabled={isLoading}
			/>
			<select
				value={inputCurrency}
				onChange={(e) => setInputCurrency(e.target.value)}
				disabled={isLoading}
			>
				<option value="USD">USD</option>
				<option value="EUR">EUR</option>
				<option value="CAD">CAD</option>
				<option value="INR">INR</option>
			</select>
			<select
				value={outputCurrency}
				onChange={(e) => setOutputCurrency(e.target.value)}
				disabled={isLoading}
			>
				<option value="USD">USD</option>
				<option value="EUR">EUR</option>
				<option value="CAD">CAD</option>
				<option value="INR">INR</option>
			</select>
			<p>
				<b>OUTPUT : </b>
				{(exchangeRate * amount).toFixed(2)} {outputCurrency}
			</p>
		</div>
	);
}
