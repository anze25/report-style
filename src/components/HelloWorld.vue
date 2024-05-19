<template>
  <div>
    <div
      v-if="!filteredData.length"
      id="fileUpload"
    >
      <h2>Izberi CSV Report datoteko</h2>
      <input
        type="file"
        @change="handleFileUpload"
      >
    </div>
    <!-- Print button -->
    <button
      variant="primary"
      v-if="filteredData.length"
      v-print="'#printable'"
    >Natisni tabelo</button>

    <div id="printable">

      <div style="display: flex; padding-bottom: 10px;">

        <div>
          <div>{{ headers1[0] }}</div>
          <div>{{ headers2[0] }}</div>
          <div>{{ headers3[0] }}</div>
        </div>
      </div>

      <div class="empty-row">
        <td
          colspan="4"
          class="bold"
        ></td> <!-- Empty row -->
      </div>
      <table
        v-show="filteredData.length"
        id="myTable"
      >

        <tr class="bold">
          <td class="datoteka">DATOTEKA</td>
          <td class="envelopes">KUVERTE</td>
          <td class="pages">STRANI</td>
          <td class="sheets">LISTI</td>
        </tr>
      </table>
      <!-- ZPP -->
      <div
        v-if="envelopes_zpp > 0"
        class="empty-row bold"
      >
        ZPP

      </div>
      <table>

        <tr
          v-for="(row, index) in    zpp   "
          :key="index"
        >
          <td class="datoteka">{{ row[0] }}</td>
          <td class="envelopes">{{ row[1] }}</td>
          <td class="pages">{{ row[2] }}</td>
          <td class="sheets">{{ row[3] }}</td>
        </tr>
        <tr
          v-if="envelopes_zpp > 0"
          class="bold"
        >
          <td>Skupaj</td>
          <td>{{ envelopes_zpp }}</td>
          <td>{{ pages_zpp }}</td>
          <td>{{ sheets_zpp }}</td>
        </tr>
      </table>

      <!-- ZPN -->
      <div
        v-if="envelopes_zpn > 0"
        class="empty-row bold "
      >ZPN
      </div>
      <table>

        <tr
          v-for="(row, index) in    zpn   "
          :key="index"
        >
          <td class="datoteka">{{ row[0] }}</td>
          <td class="envelopes">{{ row[1] }}</td>
          <td class="pages">{{ row[2] }}</td>
          <td class="sheets">{{ row[3] }}</td>
        </tr>
        <tr
          v-if="envelopes_zpn > 0"
          class="bold"
        >
          <td>Skupaj</td>
          <td>{{ envelopes_zpn }}</td>
          <td>{{ pages_zpn }}</td>
          <td>{{ sheets_zpn }}</td>
        </tr>
      </table>

      <!-- ZUP -->
      <div
        v-if="envelopes_zup > 0"
        class="empty-row bold"
      >
        ZUP
      </div>
      <table>

        <tr
          v-for="(row, index) in    zup   "
          :key="index"
        >
          <td class="datoteka">{{ row[0] }}</td>
          <td class="envelopes">{{ row[1] }}</td>
          <td class="pages">{{ row[2] }}</td>
          <td class="sheets">{{ row[3] }}</td>
        </tr>
        <tr
          v-if="envelopes_zup > 0"
          class="bold"
        >
          <td>Skupaj</td>
          <td>{{ envelopes_zup }}</td>
          <td>{{ pages_zup }}</td>
          <td>{{ sheets_zup }}</td>
        </tr>
      </table>

      <!-- NAV -->
      <div
        v-if="envelopes_nav > 0"
        class="empty-row bold"
      >NAV
      </div>
      <table>

        <tr
          v-for="(row, index) in   nav  "
          :key="index"
        >
          <td class="datoteka">{{ row[0] }}</td>
          <td class="envelopes">{{ row[1] }}</td>
          <td class="pages">{{ row[2] }}</td>
          <td class="sheets">{{ row[3] }}</td>
        </tr>
        <tr
          v-if="envelopes_nav > 0"
          class="bold"
        >
          <td>Skupaj</td>
          <td>{{ envelopes_nav }}</td>
          <td>{{ pages_nav }}</td>
          <td>{{ sheets_nav }}</td>
        </tr>

      </table>



      <!-- TOTAL -->
      <table v-show="filteredData.length">
        <tr class="bold">
          <td class="datoteka">Skupaj</td>
          <td class="envelopes">{{ envelopes }}</td>
          <td class="pages">{{ pages }}</td>
          <td class="sheets">{{ sheets }}</td>
        </tr>
      </table>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
const jsonData = ref([])
const filteredData = ref([])
const jsonDateAndTime = ref([])
const headers1 = ref('')
const headers2 = ref('')
const headers3 = ref(' ')
const zpp = ref([])
const zpn = ref([])
const zup = ref([])
const nav = ref([])

let envelopes = 0;
let pages = 0;
let sheets = 0;
let envelopes_zpp = 0;
let pages_zpp = 0;
let sheets_zpp = 0;
let envelopes_zpn = 0;
let pages_zpn = 0;
let sheets_zpn = 0;
let envelopes_zup = 0;
let pages_zup = 0;
let sheets_zup = 0;
let envelopes_nav = 0;
let pages_nav = 0;
let sheets_nav = 0;

const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (file) {
    const csvContent = await readFileContent(file);
    jsonData.value = convertCsvToJson(csvContent);
    jsonDateAndTime.value = convertCsvToJson(csvContent);
    filteredData.value = jsonData.value.filter((row) => row[0] !== 'Skupaj' && row[0] !== '\r' && row[0] !== '');

    for (const row of filteredData.value) {
      if (row[0].includes('zpp')) {
        row[4] = '1';
      } else if (row[0].includes('zpn')) {
        row[4] = '2';
      } else if (row[0].includes('zup')) {
        row[4] = '3';
      } else {
        row[4] = '4';
      }
    }

    // If index 4 values are equal, sort by index 0
    filteredData.value.sort((a, b) => {
      const compareByIndex4 = a[4].localeCompare(b[4]);
      return compareByIndex4 !== 0 ? compareByIndex4 : a[0].localeCompare(b[0]);
    });

    zpp.value = filteredData.value.filter((row) => row[4] === '1');
    zpn.value = filteredData.value.filter((row) => row[4] === '2');
    zup.value = filteredData.value.filter((row) => row[4] === '3');
    nav.value = filteredData.value.filter((row) => row[4] === '4');

    if (zpp.value) {
      for (const index in zpp.value) {

        envelopes_zpp += (parseInt(zpp.value[index][1]));
        pages_zpp += (parseInt(zpp.value[index][2]));
        sheets_zpp += (parseInt(zpp.value[index][3]));
      }
    }
    if (zpn.value) {
      for (const index in zpn.value) {

        envelopes_zpn += (parseInt(zpn.value[index][1]));
        pages_zpn += (parseInt(zpn.value[index][2]));
        sheets_zpn += (parseInt(zpn.value[index][3]));
      }
    }
    if (zup.value) {
      for (const index in zup.value) {

        envelopes_zup += (parseInt(zup.value[index][1]));
        pages_zup += (parseInt(zup.value[index][2]));
        sheets_zup += (parseInt(zup.value[index][3]));
      }
    }
    if (nav.value) {
      for (const index in nav.value) {

        envelopes_nav += (parseInt(nav.value[index][1]));
        pages_nav += (parseInt(nav.value[index][2]));
        sheets_nav += (parseInt(nav.value[index][3]));
      }
    }
    // envelopes totals
    envelopes = envelopes_zpp + envelopes_zpn + envelopes_zup + envelopes_nav
    pages = pages_zpp + pages_zpn + pages_zup + pages_nav
    sheets = sheets_zpp + sheets_zpn + sheets_zup + sheets_nav

  }

};

const readFileContent = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
};

const convertCsvToJson = (csvContent) => {
  const lines = csvContent.split('\n');
  headers1.value = lines[0].split(';').map(item => item.replace('�as', 'Čas'));
  headers2.value = lines[1].split(';').map(item => item.replace('Koli�ine', 'Količine'));


  const jsonData = lines.slice(4).map((line) => {

    return line.split(';');

  });

  // Filter out rows containing "Total" and sort by name
  const filteredAndSortedData = computed(() => {
    const filteredData = jsonData.value.filter((row) => row[0] !== 'Total');
    return filteredData.sort((a, b) => a[0].localeCompare(b[0]));
  });


  return jsonData;
};

const convertCsvToJsonDateAndTime = (csvContent) => {
  const lines = csvContent.split('\n');
  const headers = lines[3].split(';');
  const jsonDateAndTime = lines.slice(0, 3).map((line) => {

    return line.split(';');

    return jsonDateAndTime;
  });
};

</script>

<style scoped>
table {
  border-collapse: collapse;
  width: 500px;
  border: 2px solid black;
  margin: auto;
  margin-bottom: 5px;


}

th,
td {
  border: 1px solid #000000;
  padding: 4px;
  text-align: left;
  font-size: 14px;
}



.empty-row td {
  border: none !important;
  /* padding-bottom: 3px; */
}


.bold {
  padding-top: 8px;
  text-align: left;
  font-weight: 800;
}

button {
  transition-duration: 0.4s;
  border-radius: 3px;
  background-color: #008CBA;
  color: white;
}

button:hover {

  border-radius: 3px;
  background-color: white;
  color: #008CBA;

}

.datoteka {
  width: 55%;
}

.envelopes .pages .sheets {
  width: 15%;
}
</style>