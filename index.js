import https from "https";
import Readline from "readline";
import chalk from "chalk";

const rl = Readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const getValueOfCurrencies = () => {
    const url = 'https://apilayer.net/api/live?access_key=4d7e102d292ddf9a06381db4f4358402&currencies=AED,%20AFN,%20ALL,%20AMD,%20ANG,%20AOA,%20ARS,%20AUD,%20AWG,%20AZN,%20BAM,%20BBD,%20BDT,%20BGN,%20BHD,%20BIF,%20BMD,%20BND,%20BOB,%20BRL,%20BSD,%20BTN,%20BWP,%20BYN,%20BZD,%20CAD,%20CDF,%20CHF,%20CLP,%20CNY,%20COP,%20CRC,%20CUP,%20CVE,%20CZK,%20DJF,%20DKK,%20DOP,%20DZD,%20EGP,%20ERN,%20ETB,%20EUR,%20FJD,%20FKP,%20FOK,%20GBP,%20GEL,%20GGP,%20GHS,%20GIP,%20GMD,%20GNF,%20GTQ,%20GYD,%20HKD,%20HNL,%20HRK,%20HTG,%20HUF,%20IDR,%20ILS,%20IMP,%20INR,%20IQD,%20IRR,%20ISK,%20JEP,%20JMD,%20JOD,%20JPY,%20KES,%20KGS,%20KHR,%20KID,%20KMF,%20KRW,%20KWD,%20KYD,%20KZT,%20LAK,%20LBP,%20LKR,%20LRD,%20LSL,%20LYD,%20MAD,%20MDL,%20MGA,%20MKD,%20MMK,%20MNT,%20MOP,%20MRU,%20MUR,%20MVR,%20MWK,%20MXN,%20MYR,%20MZN,%20NAD,%20NGN,%20NIO,%20NOK,%20NPR,%20NZD,%20OMR,%20PAB,%20PEN,%20PGK,%20PHP,%20PKR,%20PLN,%20PYG,%20QAR,%20RON,%20RSD,%20RUB,%20RWF,%20SAR,%20SBD,%20SCR,%20SDG,%20SEK,%20SGD,%20SHP,%20SLL,%20SOS,%20SRD,%20SSP,%20STN,%20SYP,%20SZL,%20THB,%20TJS,%20TMT,%20TND,%20TOP,%20TRY,%20TTD,%20TVD,%20TWD,%20TZS,%20UAH,%20UGX,%20USD,%20UYU,%20UZS,%20VES,%20VND,%20VUV,%20WST,%20XAF,%20XCD,%20XDR,%20XOF,%20XPF,%20YER,%20ZAR,%20ZMW,%20ZWL&source=USD&format=1';

    https.get(url, (response) => {
        let currencyDetail = '';
        response.on("data", (chunk) => {
            currencyDetail += chunk;
        });

        response.on("end", () => {
            try {
                currencyDetail = JSON.parse(currencyDetail);

                // ✅ Checking if API response was successful
                if (!currencyDetail.success) {
                    console.log(chalk.red("Error: Failed to fetch currency data. Please try again later."));
                    rl.close();
                    return;
                }

                rl.question(chalk.yellow("Enter the amount in USD: "), (amount) => {
                    const amountNumber = parseFloat(amount);

                    if (isNaN(amountNumber) || amountNumber <= 0) {
                        console.log(chalk.red("Invalid amount. Please enter a valid number."));
                        rl.close();
                        return;
                    }

                    rl.question(chalk.yellow("Enter the target currency (e.g., INR, EUR, GBP): "), (currencyName) => {
                        const currencyKey = "USD" + currencyName.toUpperCase();
                        const currencyRate = currencyDetail.quotes[currencyKey];

                        if (!currencyRate) {
                            console.log(chalk.red(`Invalid currency code: ${currencyName.toUpperCase()}`));
                            rl.close();
                            return;
                        }

                        const finalValue = (currencyRate * amountNumber).toFixed(2);
                        console.log(chalk.green(`The value of ${amountNumber} USD is ${finalValue} ${currencyName.toUpperCase()}`));

                        rl.close();
                    });
                });

            } catch (error) {
                console.log(chalk.red("Error processing currency data. Please try again."));
                rl.close();
            }
        });

    }).on("error", (err) => {
        console.log(chalk.red("Failed to fetch currency rates. Please check your internet connection."));
        rl.close();
    });
};

getValueOfCurrencies();
