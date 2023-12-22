import React, { useState } from 'react';
import './App.css';
const CarRentalCalculatorForm = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        rentalDate: '',
        rentalDuration: 1,
        kilometersToDrive: 0,
        drivingLicenseYears: 0,
        carCategory: 'Basic',
    });
    const [calculationResult, setCalculationResult] = useState({
        baseRentalCost: 0,
        categoryMultiplier: 1,
        licenseMultiplier: 1,
        availabilityMultiplier: 1,
        fuelCost: 0,
        netRentalCost: 0,
        grossRentalCost: 0,
    });
    const [showResults, setShowResults] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateDriverEligibility()) {
            calculateRentalCost();
            setShowResults(true);
        }
    };
    const validateDriverEligibility = () => {
        const minLicenseYearsForPremium = 3;

        if (
            formData.drivingLicenseYears < minLicenseYearsForPremium &&
            formData.carCategory === 'Premium'
        ) {
            alert(
                'Przepraszamy, ale nie możesz wypożyczyć samochodu z kategorii Premium, ponieważ masz prawo jazdy krócej niż 3 lata.'
            );
            return false;
        }

        return true;
    };
    const calculateRentalCost = () => {
        // Constants
        const baseRentalPricePerDay = 50;
        const categoryMultipliers = {
            Basic: 1,
            Standard: 1.3,
            Medium: 1.6,
            Premium: 2,
        };
        const licenseMultiplierThreshold = 5;
        const licenseMultiplierPercentage = 20;
        const availabilityMultiplierThreshold = 3;
        const availabilityMultiplierPercentage = 15;
        const fuelCostPerKilometer = 1.6;
        const fuelEfficiency = 10;
        const taxRate = 0.23;

        const baseRentalCost = baseRentalPricePerDay * formData.rentalDuration;

        const categoryMultiplier = categoryMultipliers[formData.carCategory];

        const licenseMultiplier =
            formData.drivingLicenseYears < licenseMultiplierThreshold ? 1 + licenseMultiplierPercentage / 100 : 1;

        const availabilityMultiplier =
            availabilityMultiplierThreshold < 3 ? 1 + availabilityMultiplierPercentage / 100 : 1;

        const fuelCost = (formData.kilometersToDrive / fuelEfficiency) * fuelCostPerKilometer;

        const netRentalCost =
            (baseRentalCost * categoryMultiplier * licenseMultiplier * availabilityMultiplier) + fuelCost;

        const grossRentalCost = netRentalCost * (1 + taxRate);

        setCalculationResult({
            baseRentalCost: baseRentalCost.toFixed(2) + " zł",
            categoryMultiplier,
            licenseMultiplier,
            availabilityMultiplier,
            fuelCost: fuelCost.toFixed(2) + " zł",
            netRentalCost: netRentalCost.toFixed(2) + " zł",
            grossRentalCost: grossRentalCost.toFixed(2) + " zł",
        });
    };

    return (
        <div className="main">
            <header>
                <h1>Kalkulator wyporzyczenia auta</h1>
            </header>
            <article>
                {/*Formularz*/}
                <form onSubmit={handleSubmit}>
                    <label>
                        <span class="label-text">Imię:</span>
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange}
                               required/>
                    </label>

                    <label>
                        <span class="label-text">Nazwisko:</span>
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required/>
                    </label>

                    <label>
                        <span class="label-text">Data wypożyczenia:</span>
                        <input type="date" name="rentalDate" value={formData.rentalDate} onChange={handleChange}
                               required/>
                    </label>

                    <label>
                        <span class="label-text">Długość wypożyczenia:</span>
                        <input type="number" name="rentalDuration" value={formData.rentalDuration}
                               onChange={handleChange}
                               required/>
                    </label>

                    <label>
                        <span class="label-text">Ile kilometrów masz do przejechania?</span>
                        <input type="number" name="kilometersToDrive" value={formData.kilometersToDrive}
                               onChange={handleChange} required/>
                    </label>

                    <label>
                        <span class="label-text">Ile lat posiadasz prawo jazdy?</span>
                        <input type="number" name="drivingLicenseYears" value={formData.drivingLicenseYears}
                               onChange={handleChange} required/>
                    </label>

                    <label>
                        <span class="label-text">Car category:</span>
                        <select name="carCategory" value={formData.carCategory} onChange={handleChange} required>
                            <option value="Basic">Basic</option>
                            <option value="Standard">Standard</option>
                            <option value="Medium">Medium</option>
                            <option value="Premium">Premium</option>
                        </select>
                    </label>
                    <div style={{
                        width: "100%",
                        height: "auto",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center"
                    }}>
                        <button type="submit">
                            Oblicz koszt wynajmu
                        </button>
                    </div>
                </form>
                {/*wyniki kalkulacji*/}
                {showResults && (
                <div style={{justifyContent:"center", alignItems: "flex-start", display: "flex"}}>
                    <div style={{justifyContent:"center", alignItems: "center", display: "flex", flexDirection: "column"}}>
                    <h2>Składowe kosztu wynajmu</h2>
                        <div className="result">
                            <p>Koszt podstawowy wynajmu: {calculationResult.baseRentalCost}</p>
                        </div>
                        <div className="result">
                            <p>Mnożnik kategorii: {calculationResult.categoryMultiplier}</p>
                        </div>
                        <div className="result">
                            <p>Mnożnik prawa jazdy: {calculationResult.licenseMultiplier}</p>
                        </div>
                        <div className="result">
                            <p>Mnożnik dostępności: {calculationResult.availabilityMultiplier}</p>
                        </div>
                        <div className="result">
                            <p>Koszt paliwa: {calculationResult.fuelCost}</p>
                        </div>
                    </div>
                    <div style={{justifyContent:"center", alignItems: "center", display: "flex", flexDirection: "column"}}>
                    <h2>Koszt wynajmu</h2>
                        <div className="result">
                            <p>Netto koszt wynajmu: {calculationResult.netRentalCost}</p>
                        </div>
                        <div className="result">
                            <p>Brutto koszt wynajmu: {calculationResult.grossRentalCost}</p>
                        </div>
                    </div>
                </div>)}
                {/*Kategorie aut*/}
                <div className="container">
                    <div className="card">
                        <div className="face face1">
                            <div className="content">
                                <img src="https://i.imgur.com/x64VBkH.png" alt="Basic car image"/>
                                <h3>Basic Cars</h3>
                            </div>
                        </div>
                        <div className="face face2">
                            <div className="content">
                                <p>Idealne dla osób poszukujących ekonomicznego rozwiązania.
                                    Samochody te oferują podstawowe funkcje i wygodę jazdy.
                                    Doskonałe dla krótkich podróży i codziennego użytku.</p>
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="face face1">
                            <div className="content">
                                <img
                                    src="https://i.imgur.com/lLg5Y42.png" alt="Standart car image"/>
                                <h3>Standart Cars</h3>
                            </div>
                        </div>
                        <div className="face face2">
                            <div className="content">
                                <p>Świetny wybór dla osób, które oczekują lepszego komfortu i dodatkowych funkcji.
                                    Samochody standardowe oferują zbalansowane połączenie komfortu i ekonomii.
                                    Doskonałe dla podróży służbowych i rodzinnych wyjazdów.</p>
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="face face1">
                            <div className="content">
                                <img
                                    src="https://i.imgur.com/bp8LocA.png" alt="Medium car image"/>
                                <h3>Medium Cars</h3>
                            </div>
                        </div>
                        <div className="face face2">
                            <div className="content">
                                <p>Dla osób, które potrzebują większej przestrzeni i komfortu.
                                    Samochody średnie są idealne dla rodzin lub grup podróżujących.
                                    Oferują wyższy standard wyposażenia i większy bagażnik.</p>
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="face face1">
                            <div className="content">
                                <img
                                    src="https://i.imgur.com/NExLjsi.png" alt="Premium car image"/>
                                <h3>Premium Cars</h3>
                            </div>
                        </div>
                        <div className="face face2">
                            <div className="content">
                                <p>Najwyższy poziom luksusu i wyrafinowania.
                                    Samochody premium zapewniają najnowsze technologie i najwyższą jakość wykonania.
                                    Doskonałe dla osób ceniących komfort podróży na najwyższym poziomie.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    );
};

export default CarRentalCalculatorForm;
