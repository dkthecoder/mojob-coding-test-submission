<script>

//DID NOT use this code

/*
I had issues parsing the JSON values into props. this is probably my unfamiliarity with doing this in Vue.
Ideally I would like to make a template of JobCard to display the job itself, 
which would be iterated upon in the parent JobFeed through v-for.
*/

export default {
    props: {
        title: String
        unit_display_name: String
        position_function_name_en: String
        due_date: String
        image_url: String
        }
    }
};


</script>

<template>
    <div class="card mb-3" style="min-width: 1000px;">
        <a href="#" class="list-group-item list-group-item-action d-flex gap-3 py-3" aria-current="true">
            <img :src="job.image_url" alt="twbs" width="64" height="64" class="rounded-circle flex-shrink-0">
              <div class="d-flex gap-2 w-100 text-start">
                <div>
                    <h5 class="card-title">{{ title }}</h5>
                    <p class="card-text">{{ unit_display_name }} • {{ position_function_name_en }} • {{
                        due_date }}</p>
                </div>
            </div>
        </a>
    </div>
</template>

