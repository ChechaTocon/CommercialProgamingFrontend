export class CreateReview {
    id: number | undefined;
    comment: string | undefined;
    ranking: number | undefined;
    createdAt: string | undefined;
    updatedAt: string | undefined;
    user: number | undefined;
    movie: number | undefined;
}

export class Review {
    id: number | undefined;
    comment: string = '';
    ranking: number = 0;
    createdAt: string | undefined;
    updatedAt: string | undefined;
    user: User | undefined;
    movie: Movie | undefined;
}

export class User {
    userId: number | undefined;
    username: string | undefined;
    name: string | undefined;
    surname: string | undefined;
    password: string | undefined;
    role: number | undefined;
    createdAt: string | undefined;
    updatedAt: string | undefined;
}

export class Movie {
    id: number | undefined;
    poster: string | undefined;
    movieName: string | undefined;
    description: string | undefined;    
    createdAt: string | undefined;
    updatedAt: string | undefined;
}


export class Dialog{
    tipo: boolean | undefined;
    accion: string | undefined;
    button: string | undefined;
    departamento: string | undefined;
    municipio: string | undefined;
    descripcion: string | undefined;
}