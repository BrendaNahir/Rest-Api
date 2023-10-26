import {pool} from './database.js';

class LibrosController{
   async getAll(req, res) {
    try {
        const [result] = await pool.query('SELECT * FROM libros');
        res.json(result);
        } catch (error){
        res.status(500).json({"Error": "Ocurrió un error al obtener los libros"});
        }
    }

    async getOne(req, res){
        try {
        const libro = req.body;
        const id = parseInt(libro.id);
        const [result] = await pool.query(`SELECT * FROM libros WHERE id = (?)`, [id]);
        if (result.length > 0){
            res.json(result[0]);
        } else {
            res.status(404).json({"Error": `No se encontró el libro con el id correspondiente ${libro.id} ` });
        }
        } catch (error) {
        res.status(500).json({"Error": "Ocurrió un error al obtener el libro"});
     }
    }

    async add(req, res){
        const libro = req.body;
        
        const listaAtributos = ['id', 'nombre', 'autor', 'categoria', 'anio_publicacion', 'isbn'];
        const atributosExtra = Object.keys(libro).filter(attr => !listaAtributos.includes(attr));
    
            if (atributosExtra.length > 0) {
                return res.json({ error: `Atributos invalidos: ${atributosExtra.join(' , ')}`});
            }
            try {
                const [result] = await pool.query(`INSERT INTO Libros(id, nombre, autor, categoria, anio_publicacion, isbn) VALUES (?, ?, ?, ?, ?, ?)`,[libro.id, libro.nombre, libro.autor, libro.categoria, libro.anio_publicacion, libro.isbn]);
                res.json({"Id insertado": libro.id});
            }catch (error) {
                console.log('Error al añadir el libro:',error);
            }
    }

    async update(req, res){
        try {
        const libro = req.body;
        const [result] = await pool.query(`UPDATE Libros SET nombre=(?), autor=(?), categoria=(?), anio_publicacion=(?), isbn=(?) WHERE id=(?)`, [libro.nombre, libro.autor, libro.categoria, libro.anio_publicacion, libro.isbn, libro.id]);
        if (result.affectedRows > 0){
            res.json({"message": `Libro con id ${libro.id} actualizado exitosamente`});
        } else {
            res.status(404).json({"Error": `No se encontró ningún libro con el id ${libro.id}` });
        }
      } catch (error) {
        res.status(500).json({"Error": "Ocurrió un error al eliminar el libro"});
      } 
    }

    async delete(req, res){
        try {
        const libro = req.body;
        const [result] = await pool.query(`DELETE FROM Libros WHERE isbn=(?)`,[libro.isbn]);
        if (result.affectedRows > 0){
            res.json({"message": `Libro con ISBN ${libro.isbn} eliminado exitosamente`});
        } else {
            res.status(404).json({"Error": `No se encontró ningún libro con el ISBN ${libro.isbn}` });
        }
      } catch (error) {
        res.status(500).json({"Error": "Ocurrió un error al eliminar el libro"});
      } 
    }
    

}

export const libro = new LibrosController();