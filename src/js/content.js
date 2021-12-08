export class Content {
    constructor(app) {
        this.app = app;
        this.app.content = this;
    }

    async contentsTreatment(contents) {

        var treatedContent = [`<div class="card"><div class="card-content card-content-padding">`];
        for await (let content of contents) {


            switch (content.tipo) {
                case "texto":
                    treatedContent.push(await this.text(content));
                    break;
                case "mapa":
                    treatedContent.push(await this.map(content));
                    break;
                case "link":
                    treatedContent.push(await this.littleCard(content));
                    break;
                case "video":
                    treatedContent.push(await this.video(content));
                    break;
                case "telefone":
                    treatedContent.push(await this.littleCard(content));
                    break;
                case "email":
                    treatedContent.push(await this.littleCard(content));
                    break;
                case "imagem":
                    treatedContent.push(await this.imagem(content));
                    break;
                case undefined:
                    treatedContent.push(await this.breakline(content));
                    break;
                case "novo bloco":
                    treatedContent.push(await this.newCard(content));
                    break;
                default:
                    treatedContent.push(content.conteudo);
                    break;
            }
        }

        return treatedContent;
    }

    async text(data) {
        let item = '';
        switch (data.estilo) {
            case "grande":
                item = `<div class="custom-text-large">${data.conteudo}</div>`;
                break;
            case "médio":
                item = `<div class="custom-text-medium">${data.conteudo}</div>`;
                break;
            case "pequeno":
                item = `<div class="custom-text-small">${data.conteudo}</div>`;
                break;
            case undefined:
                item = `<div>${data.conteudo}</div>`;
        }

        return item;
    }

    async map(data) {
        let item = '';
        switch (data.estilo) {
            case "grande":
                item = `<iframe class="custom-map-large" src="${data.conteudo}" width="100%" height="100%" style="border:0; aspect-ratio: 1;" allowfullscreen="true"></iframe>`;
                break;
            case "médio":
                item = `<iframe class="custom-map-medium" src="${data.conteudo}" width="100%" height="100%" style="border:0; aspect-ratio: 1;" allowfullscreen="true"></iframe>`;
                break;
            case "pequeno":
                item = `<iframe class="custom-map-small" src="${data.conteudo}" width="100%" height="100%" style="border:0; aspect-ratio: 1;" allowfullscreen="true"></iframe>`;
                break;
            case undefined:
                item = `<iframe src="${data.conteudo}" width="100%" height="100%" style="border:0; aspect-ratio: 1;" allowfullscreen="true"></iframe>`;
        }
        return item;
    }


    async breakline(data) {
        let item = `<br>`;
        return item;
    }

    async newCard(data) {
        let item = `</div></div><div class="card"><div class="card-content card-content-padding">`;

        return item;
    }

    async style_video_image(data) {
        switch (data.estilo) {
            case "pequeno": 
                return data.tipo == 'imagem' ? 'custom-image-small' : 'custom-video-small';  
            case "médio":   
                return data.tipo == 'imagem' ? 'custom-image-medium' : `custom-video-medium`; 
            default: 
                return data.tipo == 'imagem' ? 'custom-image-large' : `custom-video-large`;  
        }

    }

    async video(data) {
        function getId(url) {
            var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            var match = url.match(regExp);

            if (match && match[2].length == 11) return match[2];
            else return 'error';
        }

        var videoId = getId(data.conteudo);
        
        let item = `${data.extra == undefined ? '' : '<h3><strong>$'+ data.extra+ '</strong></h3>' } + 
        '<iframe class="width-100 ${style_video_image(data)}" frameborder="0" src="//www.youtube.com/embed/${videoId}"></iframe>`;

        return item;
    }

    async littleCard(data){
        if (data.extra == undefined) {
            data.extra = data.tipo == "email" ? "E-mail" : (data.tipo == "telefone" ? "Telefone" : undefined);
        }
        
        return `<div style='display: flex; align-items: center; justify-content: space-between; width:100%; margin: 7px 0 7px 0'>
                    <div class="item-media" style="padding-right:8px;"><i class="f7-icons">${data.tipo == "email" ? "rectangle_paperclip" : (data.tipo == "telefone" ? "phone" : "globe")}</i></div>
                    <div style='display: flex; align-items: center; justify-content: ${data.extra == undefined ? "flex-end" : "space-between"}; width:100%;'>
                        ${data.extra == undefined ? "" : "<p style='max-width: 50%; text-align: center;'>" + data.extra.substr(0, 25) + "</p>"}
                        <a class="external" href="${data.tipo == "email" ? "mailto:" : (data.tipo == "telefone" ? "tel:+" : "")}${data.conteudo}">${data.extra != undefined ? "Acessar" : data.conteudo.substr(0, 50)}</a>
                    </div>
                </div>`;    
    } 

    async imagem(data) {
        let url = data.conteudo;
        let found = url.match(/d\/([A-Za-z0-9\-_]+)/);

        if (found) {
            let new_url = 'https://drive.google.com/uc?export=view&id=' + found[1];
            console.log(new_url)
            data.conteudo = new_url;
        };

        let item = `<img class="${style_video_image(data)}" src="${data.conteudo}" alt="Imagem" width="100%"/>${(((data.extra != undefined) && (data.extra != '')) ? '<p><em>' + data.extra + '</em></p>' : '')}`;
        return item;
    }

}