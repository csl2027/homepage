document.addEventListener("DOMContentLoaded", async () => {
	const roleLists = {
		PCC: document.getElementById("pcc-list"),
		PC: document.getElementById("pc-list"),
		LO: document.getElementById("lo-list")
	};

	if (!roleLists.PCC || !roleLists.PC || !roleLists.LO) {
		return;
	}

	try {
		const response = await fetch("people.json");
		if (!response.ok) {
			throw new Error(`Failed to load people.json: ${response.status}`);
		}

		const people = await response.json();
		const entriesByRole = {
			PCC: [],
			PC: [],
			LO: []
		};

		people.forEach((person) => {
			const roles = (person.ROLE || "")
				.split(",")
				.map((role) => role.trim().toUpperCase())
				.filter(Boolean);

			const nameHtml = person.WEBSITE
				? `<a href="${person.WEBSITE}" target="_blank">${person.SURNAME} ${person.NAME}</a>`
				: `${person.SURNAME} ${person.NAME}`;
			const itemText = `${nameHtml} (${person.AFFILIATION}, ${person.COUNTRY})`;

			roles.forEach((role) => {
				if (!entriesByRole[role]) {
					return;
				}

				entriesByRole[role].push({
					surname: person.SURNAME || "",
					name: person.NAME || "",
					itemText
				});
			});
		});

		Object.keys(entriesByRole).forEach((role) => {
			entriesByRole[role]
				.sort((a, b) => {
					const surnameCompare = a.surname.localeCompare(b.surname, undefined, { sensitivity: "base" });
					if (surnameCompare !== 0) {
						return surnameCompare;
					}

					return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
				})
				.forEach((entry) => {
					const li = document.createElement("li");
					li.innerHTML = entry.itemText;
					roleLists[role].appendChild(li);
				});
		});
	} catch (error) {
		console.error(error);
	}
});
