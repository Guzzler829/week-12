var globalTexarea;

class Note {
    constructor(title, text) {
        this.title = title;
        this.text = text;
    }
}

class NoteService {
    static url = "https://62ac15b79fa81d00a7a9487d.mockapi.io/api/v1/notes";

    static getAllNotes() {
        return $.get(this.url);
    }
    static getNote(id) {
        return $.get(this.url + `/${id}`);
    }
    static createNote (note) {
        //return $.post(this.url, note);

        return $.ajax({
            url: this.url,
            dataType: 'json',
            data: JSON.stringify(note),
            contentType: 'application/json',
            type: 'POST'
        });
    }
    static updateNote(note) {
        return $.ajax({
            url: this.url + `/${note._id}`,
            dataType: 'json',
            data: JSON.stringify(note),
            contentType: 'application/json',
            type: 'PUT'
        });
    }
    static deleteNote(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
        });
    }
}

class DOMManager {
    static notes;

    static getAllNotes() {
        NoteService.getAllNotes().then(notes => this.render(notes));
    }

    static createNote() {
        let noteTitle = $("#new-note-title").val();
        let noteText = $("#new-note-text").val();
        let newNote = new Note(noteTitle, noteText);
        NoteService.createNote(newNote);
        DOMManager.getAllNotes();
        //console.log("Sent request to create note.");
    }

    static editNote(id) {
        //let noteElement = $('#' + id);
        let cardText = $('#' + id + " .card-text");
        let theText = cardText.html(); //get the text from the cardText element
        let textarea = document.createElement('textarea'); //make a new textarea element
        globalTexarea = textarea;
        textarea.setAttribute('cols', '40');
        textarea.setAttribute('rows', '5');
        textarea.setAttribute('id', id + '-edit');
        textarea.setAttribute('class', 'form-control');
        textarea.setAttribute('placeholder', 'New text');
        
        cardText.prepend(textarea);
        let newTextarea = $('#' + id + ' textarea');
        newTextarea.val(theText); //set the value of the new text area to theText
        //cardText.remove(); //for some reason this removes the text before it can be read by the cardText variable assignment at the top.
    }

    static updateNote(id, note) {
        note.text = globalTexarea.value;
        NoteService.updateNote(id);
    }

    static deleteNote(id) {
        NoteService.deleteNote(id)
            .then(() => {
                return NoteService.getAllNotes();
            })
            .then((notes) => this.render(notes));
    }

    static render(notes) {
        this.notes = notes;
        $("#app").empty();
        for (let note of notes) {
            $("#app").prepend(/*html*/`
                <div id="${note.id}" class="card">
                    <div class="card-header">

                        <h2>${note.title}</h2>
                        <div class="card-text">${note.text}</div>

                        <div class="card">
                            <div class="row">
                                <button class="btn btn-danger" onclick="DOMManager.deleteNote('${note.id}')">Delete</button>
                                <button class="btn btn-secondary" onclick="let myNote = '${note}'; console.log(myNote); DOMManager.updateNote('${note.id}', myNote);">Update</button>
                                <button class="btn btn-secondary" onclick="DOMManager.editNote('${note.id}')">Edit</button>
                            </div>
                        </div>

                    </div>
                </div>
            `);
        }
    }
}

DOMManager.getAllNotes();
