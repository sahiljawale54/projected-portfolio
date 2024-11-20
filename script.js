document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("investment-form");
  const typeSelect = document.getElementById("type");
  const customTypeField = document.getElementById("custom-type-field");
  const customTypeInput = document.getElementById("custom-type");
  const investmentList = document.getElementById("investment-list");
  const totalAmountDisplay = document.getElementById("total-amount");

  const investments = JSON.parse(localStorage.getItem("investments")) || [];

  const calculateFutureValue = (monthly, rate, years) => {
    const annualRate = rate / 100;
    const months = years * 12;
    return (
      monthly *
      ((Math.pow(1 + annualRate / 12, months) - 1) / (annualRate / 12))
    ).toFixed(2);
  };

  const formatToIndianNumberSystem = (num) => {
    const crore = Math.floor(num / 1e7);
    const lakh = Math.floor((num % 1e7) / 1e5);
    let result = "";

    if (crore > 0) result += `${crore} Crore `;
    if (lakh > 0) result += `${lakh} Lakh `;
    return result.trim();
  };

  const formatWithCommas = (num) => {
    return parseFloat(num).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const renderInvestments = () => {
    const resultsSection = document.getElementById("results");
    if (investments.length === 0) {
      resultsSection.style.display = "none"; // Hide section if no investments
    } else {
      resultsSection.style.display = "block"; // Show section if investments exist
    }
    investmentList.innerHTML = "";
    let totalProjected = 0;

    investments.forEach((inv, index) => {
      const futureValue = calculateFutureValue(
        inv.monthly,
        inv.rate,
        inv.years
      );
      totalProjected += parseFloat(futureValue);

      const li = document.createElement("li");
      li.innerHTML = `
                <strong>${inv.type}</strong>: ₹${formatWithCommas(
        inv.monthly
      )} monthly, ${inv.rate}% return for ${inv.years} years.
                <br>Projected Value: <strong>₹${formatWithCommas(
                  futureValue
                )} (${formatToIndianNumberSystem(futureValue)})</strong>
                <button onclick="deleteInvestment(${index})">Delete</button>
            `;
      investmentList.appendChild(li);
    });

    totalAmountDisplay.innerText = `${formatWithCommas(
      totalProjected
    )} i.e ${formatToIndianNumberSystem(totalProjected)}`;
  };

  window.deleteInvestment = (index) => {
    investments.splice(index, 1);
    localStorage.setItem("investments", JSON.stringify(investments));
    renderInvestments();
  };

  typeSelect.addEventListener("change", () => {
    if (typeSelect.value === "Other") {
      customTypeField.style.display = "block";
    } else {
      customTypeField.style.display = "none";
      customTypeInput.value = "";
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let type = typeSelect.value;
    if (type === "Other") {
      type = customTypeInput.value.trim();
      if (!type) {
        alert("Please enter a custom type.");
        return;
      }
    }

    const monthly = parseFloat(document.getElementById("amount").value);
    const rate = parseFloat(document.getElementById("rate").value);
    const years = parseInt(document.getElementById("duration").value);

    const newInvestment = { type, monthly, rate, years };
    investments.push(newInvestment);
    localStorage.setItem("investments", JSON.stringify(investments));
    form.reset();
    renderInvestments();
  });

  renderInvestments();
});
