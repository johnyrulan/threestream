<template>
    <!-- <div class="img-upload-holder">
        <input v-show="false" id="imageInputEl" type="file" accept=".jpg,.jpeg,.png" @change="onImageInputChange" />
        <img :src="image"
             @click.prevent="openImage()"
             @error="$event.target.src = defaultImage" />
        <div style="color: #3369ff !important; margin-top: 10px !important" class="img-upload-cover upload-text text-center" @click.prevent="openImage()">
            <a><u>Upload an image</u></a>
        </div>
    </div> -->

    <main class="py-6">
        <div class="container-fluid max-w-screen-md vstack gap-6">
            <div class="card">
            <div class="card-body">
                <div class="d-flex align-items-center">
                <div>
                    <div class="d-flex align-items-center">
                    <input v-show="false" id="imageInputEl" type="file" accept=".jpg,.jpeg,.png" @change="onImageInputChange" />
                    <a href="#" class="avatar avatar-lg bg-warning rounded-circle text-white">
                        <img id="imgEl" alt="..." :src="image"
                        @click.prevent="openImage()" @error="$event.target.src = defaultImage" />
                    </a>
                    <div class="ms-4">

                    </div>
                    </div>
                </div>
                <div class="ms-auto">
                    <button type="button" class="btn btn-sm btn-neutral" @click.prevent="openImage()">Upload</button>
                </div>
                </div>
            </div>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RestApi } from '@/services/RestApi';
import { v4 as uuidv4 } from 'uuid';
import { UploadType } from '@/enums/CommonEnums';

const imageInput = ref(null);
let fileName = `${uuidv4()}.jpg`;
const baseUrl = import.meta.env.VITE_AZURE_STORAGE_URL;

const props = defineProps({
    image: String,
    defaultImage: String,
    uploadType: String
});

const emit = defineEmits<{
    (e: 'imageUploaded', fileName: string): void
}>();

async function onImageInputChange() {
    let file = (document.getElementById('imageInputEl') as HTMLInputElement).files[0];
    if (file) {
        await uploadImage(file);
    }
}

function openImage() {
    (document.getElementById('imageInputEl') as HTMLInputElement).click();
}

async function uploadImage(image : Blob) {
    if (!image) return;

    try {
        fileName = `${uuidv4()}.jpg`;

        await RestApi.Upload.uploadImage(fileName, image, props.uploadType as UploadType);

        if (props.uploadType === 'User') {
            (document.getElementById('imgEl') as HTMLImageElement).src = `${baseUrl}/user/${fileName}`;
        }

        emit('imageUploaded', fileName);
    } catch (err: any) {
       console.log(err);
    }
}

</script>

<style>

</style>