<script lang="ts">
import type { JobListing, PositionFunction } from '@/models/models'
import JobCard from '../components/JobCard.vue'

/*
export interface Props {
  jobListings: JobListing[]
  positionFunctions: PositionFunction[]
}
const props = withDefaults(defineProps<Props>(), {
  jobListings: () => [],
  positionFunctions: () => []
})
*/

export default {
  data() {
    return {
      jobs: [], //jobs objects from api call are stored here.
      selectedUrl: 'https://test-api.mojob.io/public/job/job-feed/?page=1&page_size=5', //default url for api call on inital page load.
      selectedButtonText: 'Jobs per page 5', //text to be places in button for how many jobs are displayed.
      selectedPositions: [], //selected positions.
      loadingMore: false //flag to track loading more jobs.
    };
  },
  computed: {
    filteredJobs() {
      if (this.selectedPositions.length === 0) { //will display all jobs.
        return this.jobs;
      } else { //filter jobs if checkbox is checked.
        return this.jobs.filter(job =>
          this.selectedPositions.includes(job.position_function_name_en)
        );
      }
    },
    positionFunctions() { //creates map with unique job types.
      const uniquePositions = [...new Set(this.jobs.map(job => job.position_function_name_en))];
      return uniquePositions;
    }
  },
  mounted() {
    this.fetchJobsAndMoreJobs() //run on initial page load to populate page.

    window.addEventListener('scroll', () => { //event listener if user scrolls to bottom
      const scrollPosition = window.innerHeight + window.pageYOffset;
      const documentHeight = document.documentElement.scrollHeight;

      if (
        this.selectedButtonText === 'Showing all Jobs' && scrollPosition >= documentHeight && !this.loadingMore) {
        this.fetchJobsAndMoreJobs();
      }
    });
  },
  watch: {
    selectedUrl() {
      this.fetchJobsAndMoreJobs()
    }
  },
  methods: {
    setUrl(url) {
      this.selectedUrl = url;
      this.selectedPositions = [];
      this.fetchJobsAndMoreJobs(url);
      const pageSizeNumber = url.match(/page_size=(\d+)/)[1]; //extract page size number from API reqeust.
      if (pageSizeNumber === '0') { //will set button text if showing all jobs.
        this.selectedButtonText = 'Showing all Jobs';
      } else { //update button text with page size number (5 or 25).
        this.selectedButtonText = `Jobs per page ${pageSizeNumber}`;
      }
    },

    fetchJobsAndMoreJobs(url = null) {
      if (this.loadingMore) {
        return; //prevent multiple simultaneous requests
      }

      this.loadingMore = true;
      let apiUrl = url || this.selectedUrl;

      fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
          const newJobs = data.results;
          if (this.selectedButtonText === 'Showing all Jobs') {
            this.jobs = this.jobs.concat(newJobs);
          } else {
            this.jobs = newJobs;
          }
          this.loadingMore = false;

          if (data.next && this.selectedButtonText === 'Showing all Jobs') { //increment page number in the API URL
            const urlObject = new URL(data.next);
            const nextPageNumber = parseInt(urlObject.searchParams.get('page')) || 1;
            urlObject.searchParams.set('page', nextPageNumber + 1);
            const nextPageUrl = urlObject.toString();

            this.fetchJobsAndMoreJobs(nextPageUrl); //fetch more jobs from the next page
          }
        })
        .catch(err => {
          console.log(err.message);
          this.loadingMore = false;
        });
    }
  }
};


</script>

<template>
  <div class="d-flex flex-column flex-md-row p-4 gap-4 py-md-3 justify-content-center bg-light">
    <div class="list-group d-grid gap-2 border-0">

      <div class="container">
        <nav class="navbar justify-content-between">
          <div class="dropdown">
            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1"
              data-bs-toggle="dropdown" aria-expanded="false">Filter by Position</button>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
              <li><a class="dropdown-item checkbox" href="#" v-for="position in positionFunctions" :key="position">
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" :value="position" v-model="selectedPositions" />
                    <label class="form-check-label" for="Checkme2">{{ position }}</label>
                  </div>
                </a></li>
            </ul>
          </div>

          <div class="dropdown">
            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton2"
              data-bs-toggle="dropdown" aria-expanded="false">{{ selectedButtonText }}</button>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton2">
              <li><a class="dropdown-item" href="#"
                  v-on:click="setUrl('https://test-api.mojob.io/public/job/job-feed/?page=1&page_size=5')">5 per page</a>
              </li>
              <li><a class="dropdown-item" href="#"
                  v-on:click="setUrl('https://test-api.mojob.io/public/job/job-feed/?page=1&page_size=25')">25 per
                  page</a></li>
              <li><a class="dropdown-item" href="#"
                  v-on:click="setUrl('https://test-api.mojob.io/public/job/job-feed/?page=1&page_size=0')">Display All</a>
              </li>
            </ul>
          </div>
        </nav>
      </div>


      <div v-if="jobs">
        <div v-for="job in filteredJobs" :key="job.id">

          <div class="card mb-3" style="min-width: 1000px;">
            <a href="#" class="list-group-item list-group-item-action d-flex gap-3 py-3" aria-current="true">
              <img :src="job.image_url" alt="twbs" width="64" height="64" class="rounded-circle flex-shrink-0">
              <div class="d-flex gap-2 w-100 text-start">
                <div>
                  <h5 class="card-title">{{ job.title }}</h5>
                  <p class="card-text">{{ job.unit_display_name }} • {{ job.position_function_name_en }} • {{
                    job.due_date }}</p>
                </div>
              </div>
            </a>
          </div>

        </div>
      </div>

      <div v-if="loadingMore" class="text-center">
        <p>Loading more jobs...</p>
      </div>

      <div v-if="jobs === []">
        <p>loading jobs...</p>
      </div>

    </div>
  </div>
</template>
