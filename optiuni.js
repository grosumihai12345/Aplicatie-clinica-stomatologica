//functie care arata descrierea optiunilor de tratament
function showDescription() {
  const selectBox = document.getElementsByName("tratament")[0];
  const selectedValue = selectBox.options[selectBox.selectedIndex].value;
  localStorage.setItem("tratamentSelectat", selectedValue);
  let description = "";
  switch (selectedValue) {
    case "consultatie":
      description = "O examinare generală a dinților și gingiilor.";
      break;
    case "consultatie_specialist":
      description = "O examinare detaliată de către un specialist.";
      break;
    case "radiografie_retrodentoalveolara":
      description =
        "O radiografie dentară care arată dinții și structurile de suport din jurul lor.";
      break;
    case "ortopantomografie":
      description =
        "O radiografie panoramică care arată toți dinții, maxilarul și mandibula.";
      break;
    case "detartraj_periaj":
      description =
        "Curățarea plăcii bacteriene și a tartrului de pe dinți, urmată de periajul dentar.";
      break;
    case "airflow":
      description =
        "Curățarea suprafețelor dinților cu ajutorul unui jet de aer și apă sub presiune.";
      break;
    case "detartraj_periaj_airflow":
      description =
        "Curățarea plăcii bacteriene și a tartrului de pe dinți, urmată de periajul dentar și curățarea suprafețelor dentare cu ajutorul unui jet de aer și apă sub presiune.";
      break;
    case "sigilare":
      description =
        "Aplicarea unui strat de material plastic pe suprafețele dinților pentru a preveni cariile dentare.";
      break;
    case "fluorizare":
      description =
        "Aplicarea unui strat de fluor pe dinți pentru a-i proteja împotriva cariilor dentare.";
      break;
    case "gutiera_bruxism":
      description =
        "O proteză dentară care acoperă dinții și este purtată în timpul somnului pentru a preveni deteriorarea dinților cauzată de scrâșnitul dinților.";
      break;
    case "obturatie_carie_simpla":
      description =
        "Umplerea unei carii dentare care afectează doar o suprafață a dintelui.";
      break;
    case "obturatie_carie_medie":
      description =
        "Umplerea unei carii dentare care afectează mai mult de o suprafață a dintelui.";
      break;
    case "obturatie_carie_avansata":
      description =
        "Umplerea unei carii dentare care afectează o suprafață mare a dintelui sau implică pulpa dentară.";
      break;
    case "tratament_endodontic":
      description =
        "Îndepărtarea pulpei infectate din interiorul dintelui și sigilarea canalelor radiculare.";
      break;
    case "tratament_endodontic_microscop":
      description =
        "Îndepărtarea pulpei infectate din interiorul dintelui cu ajutorul unui microscop și sigilarea canalelor radiculare.";
      break;
    case "montare_aparat_fix_metalic":
      description =
        "Montarea unui aparat dentar fix metalic pe o arcadă dentară.";
      break;
    case "montare_aparat_fix_safir":
      description =
        "Montarea unui aparat dentar fix de safir pe o arcadă dentară.";
      break;
    case "aparat_dentar_mobil":
      description =
        "Folosirea unui aparat dentar mobil pentru a corecta poziția dinților.";
      break;
    case "activare_aparat_fix_metalic":
      description =
        "Ajustarea și activarea unui aparat dentar fix metalic pe o arcadă dentară.";
      break;
    case "activare_aparat_fix_safir":
      description =
        "Ajustarea și activarea unui aparat dentar fix de safir pe o arcadă dentară.";
      break;
    case "fir_contentie":
      description =
        "Plasarea unui fir de contentie pentru a menține dinții în poziția corectă după îndepărtarea unui aparat dentar fix.";
      break;
    case "chirurgie_orala":
      description =
        "Includ diferite proceduri chirurgicale în zona dinților și a maxilarului.";
      break;
    case "extractie":
      description = "Extractie simpla a unui dinte deteriorat sau afectat.";
      break;
    case "extractie_molar_minte":
      description =
        "Extractie a unui molar de minte, adesea necesară când acești dinți nu se pot dezvolta corect sau cauzează probleme.";
      break;
    case "extractie_rest_radicular":
      description =
        "Extractie a unei rădăcini dentare rămase în gură după o extracție anterioară sau după o fractură.";
      break;
    case "implant_dentar":
      description =
        "Implantarea unui dispozitiv din titan pentru a înlocui un dinte lipsă.";
      break;
    case "coroana-provizorie":
      description =
        "Coroană temporară folosită în timp ce coroana permanentă este realizată în laborator.";
      break;
    case "coroana-ceramica":
      description =
        "Coroană permanentă realizată din ceramică, care se potrivește culorii și texturii dinților naturali.";
      break;
    case "coroana-zirconiu":
      description =
        "Coroană permanentă realizată din zirconiu, un material durabil și estetic.";
      break;
    case "coroana-metalica":
      description =
        "Coroană permanentă realizată dintr-un aliaj metalic, care este mai rezistent decât alte materiale dar mai puțin estetic.";
      break;
    case "fatete-dentare":
      description =
        "Fațete subțiri de ceramică sau compozit care se aplică peste dinți pentru a îmbunătăți aspectul estetic.";
      break;
    case "proteza-dentara-mobila":
      description =
        "Proteză dentară care poate fi scoasă și pusă înapoi de către pacient.";
      break;
    case "proteza-dentara-fixa":
      description =
        "Proteză dentară care este cimentată în loc și nu poate fi îndepărtată de pacient.";
      break;
    case "sigilari-fluorizari-placa-bacteriana":
      description = "Sigilări, fluorizări, evidentiere placa bacteriana";
      break;
    case "obturatie":
      description = "Obturatie";
      break;
    case "extractie-dinte-temporar":
      description = "Extractie dinte temporar";
      break;
    case "coroana-pedodontica":
      description = "Coroana pedodontică";
      break;
    case "albire-dentara":
      description = "Albire dentară";
      break;
    case "gutiera-albire":
      description = "Gutieră albire";
      break;
    case "bijuterii-dentare":
      description = "Bijuterii dentare";
      break;
    default:
      description = "Nu există descriere pentru această opțiune.";
  }
  document.getElementById("descriere").innerHTML = description;
}

const tratamentSelectat = localStorage.getItem("tratamentSelectat");
if (tratamentSelectat) {
  const selectBox = document.getElementsByName("tratament")[0];
  const options = selectBox.options;
  for (let i = 0; i < options.length; i++) {
    if (options[i].value === tratamentSelectat) {
      selectBox.selectedIndex = i;
      break;
    }
  }
  const selectedOptionDiv = document.getElementById("tratamentSelectat");
  const selectedValue = selectBox.options[selectBox.selectedIndex].value;
  //selectedOptionDiv.innerText = "Optiunea selectată este: " + selectedValue;
}
