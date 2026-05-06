from app import app
from models import Movie, Seat, db
from datetime import datetime

def seed_movies():
    """Seed the database with Bollywood movies."""
    movies_data = [
        {
            'id': 1,
            'title': 'Dangal',
            'genre': ['Drama', 'Sports', 'Biography'],
            'rating': 8.4,
            'duration': 161,
            'release_date': '2016-12-21',
            'description': 'Former wrestler Mahavir Singh Phogat and his two wrestler daughters struggle towards glory at the Commonwealth Games in the face of societal oppression.',
            'director': 'Nitesh Tiwari',
            'cast': ['Aamir Khan', 'Sakshi Tanwar', 'Fatima Sana Shaikh', 'Sanya Malhotra'],
            'poster_url': '/movie-posters/dangal.jpg',
            'trailer_url': 'https://example.com/trailer1',
            'language': 'Hindi',
            'age_rating': 'PG-13',
            'price': 325.0
        },
        {
            'id': 2,
            'title': 'Bahubali: The Beginning',
            'genre': ['Action', 'Adventure', 'Drama'],
            'rating': 8.1,
            'duration': 159,
            'release_date': '2015-07-10',
            'description': 'In ancient India, an adventurous young man becomes involved in a decades-old feud between two warring peoples.',
            'director': 'S.S. Rajamouli',
            'cast': ['Prabhas', 'Rana Daggubati', 'Anushka Shetty', 'Tamannaah Bhatia'],
            'poster_url': '/movie-posters/bahubali.jpg',
            'trailer_url': 'https://example.com/trailer2',
            'language': 'Hindi',
            'age_rating': 'PG-13',
            'price': 340.0
        },
        {
            'id': 3,
            'title': 'Padmaavat',
            'genre': ['Drama', 'History', 'Romance'],
            'rating': 7.0,
            'duration': 164,
            'release_date': '2018-01-25',
            'description': 'Set in medieval Rajasthan, Queen Padmavati is married to a noble king and they live in a prosperous fortress with their subjects until an ambitious Sultan hears of Padmavati\'s beauty and forms an obsessive desire to possess her.',
            'director': 'Sanjay Leela Bhansali',
            'cast': ['Deepika Padukone', 'Shahid Kapoor', 'Ranveer Singh', 'Aditi Rao Hydari'],
            'poster_url': '/movie-posters/padmaavat.jpg',
            'trailer_url': 'https://example.com/trailer3',
            'language': 'Hindi',
            'age_rating': 'PG-13',
            'price': 330.0
        },
        {
            'id': 4,
            'title': 'Gully Boy',
            'genre': ['Drama', 'Music'],
            'rating': 8.2,
            'duration': 154,
            'release_date': '2019-02-14',
            'description': 'A coming-of-age story based on the lives of street rappers in Mumbai.',
            'director': 'Zoya Akhtar',
            'cast': ['Ranveer Singh', 'Alia Bhatt', 'Siddhant Chaturvedi', 'Vijay Varma'],
            'poster_url': '/movie-posters/gully-boy.jpg',
            'trailer_url': 'https://example.com/trailer4',
            'language': 'Hindi',
            'age_rating': 'PG-13',
            'price': 300.0
        },
        {
            'id': 5,
            'title': 'Raazi',
            'genre': ['Action', 'Drama', 'Thriller'],
            'rating': 7.8,
            'duration': 138,
            'release_date': '2018-05-11',
            'description': 'A Kashmiri woman agrees to marry a Pakistani army officer in order to spy on Pakistan during the Indo-Pakistani War of 1971.',
            'director': 'Meghna Gulzar',
            'cast': ['Alia Bhatt', 'Vicky Kaushal', 'Rajit Kapoor', 'Shishir Sharma'],
            'poster_url': '/movie-posters/raazi.jpg',
            'trailer_url': 'https://example.com/trailer5',
            'language': 'Hindi',
            'age_rating': 'PG-13',
            'price': 315.0
        },
        {
            'id': 6,
            'title': 'Andhadhun',
            'genre': ['Crime', 'Thriller'],
            'rating': 8.3,
            'duration': 139,
            'release_date': '2018-10-05',
            'description': 'A series of mysterious events change the life of a blind pianist who has been able to see the colors in the form of music.',
            'director': 'Sriram Raghavan',
            'cast': ['Ayushmann Khurrana', 'Tabu', 'Radhika Apte', 'Anil Dhawan'],
            'poster_url': '/movie-posters/andhadhun.jpg',
            'trailer_url': 'https://example.com/trailer6',
            'language': 'Hindi',
            'age_rating': 'PG-13',
            'price': 305.0
        },
        {
            'id': 7,
            'title': 'Uri: The Surgical Strike',
            'genre': ['Action', 'Drama', 'War'],
            'rating': 8.3,
            'duration': 102,
            'release_date': '2019-01-11',
            'description': 'Indian army special forces execute a covert operation, avenging the killing of fellow army men at their base by a terrorist group.',
            'director': 'Aditya Dhar',
            'cast': ['Vicky Kaushal', 'Paresh Rawal', 'Mohit Raina', 'Yami Gautam'],
            'poster_url': '/movie-posters/uri.jpg',
            'trailer_url': 'https://example.com/trailer7',
            'language': 'Hindi',
            'age_rating': 'PG-13',
            'price': 320.0
        },
        {
            'id': 8,
            'title': 'Sanju',
            'genre': ['Biography', 'Comedy', 'Drama'],
            'rating': 7.8,
            'duration': 155,
            'release_date': '2018-06-29',
            'description': 'Biopic of actor Sanjay Dutt, exploring his life and times in Bollywood and his struggles with the law.',
            'director': 'Rajkumar Hirani',
            'cast': ['Ranbir Kapoor', 'Paresh Rawal', 'Manisha Koirala', 'Vijay Raaz'],
            'poster_url': '/movie-posters/sanju.jpg',
            'trailer_url': 'https://example.com/trailer8',
            'language': 'Hindi',
            'age_rating': 'PG-13',
            'price': 310.0
        },
        {
            'id': 9,
            'title': 'Kabir Singh',
            'genre': ['Drama', 'Romance'],
            'rating': 7.1,
            'duration': 173,
            'release_date': '2019-06-21',
            'description': 'Kabir, a genius yet notorious college student, falls hard for fellow student Preeti. The young couple embarks on a journey marred by the dark side of fame.',
            'director': 'Sandeep Reddy Vanga',
            'cast': ['Shahid Kapoor', 'Kiara Advani', 'Arjan Aujla', 'Soham Majumdar'],
            'poster_url': '/movie-posters/kabir-singh.jpg',
            'trailer_url': 'https://example.com/trailer9',
            'language': 'Hindi',
            'age_rating': 'PG-13',
            'price': 285.0
        },
        {
            'id': 10,
            'title': 'Article 15',
            'genre': ['Crime', 'Drama', 'Mystery'],
            'rating': 8.2,
            'duration': 130,
            'release_date': '2019-06-28',
            'description': 'The film is based on the Nirbhaya case and other true events, where three young women are murdered in the village and the police officer has to investigate the case.',
            'director': 'Anubhav Sinha',
            'cast': ['Ayushmann Khurrana', 'Nassar', 'Manoj Pahwa', 'Kumud Mishra'],
            'poster_url': '/movie-posters/article-15.jpg',
            'trailer_url': 'https://example.com/trailer10',
            'language': 'Hindi',
            'age_rating': 'PG-13',
            'price': 295.0
        },
        {
            'id': 11,
            'title': 'The Zoya Factor',
            'genre': ['Comedy', 'Romance', 'Sport'],
            'rating': 6.8,
            'duration': 135,
            'release_date': '2019-09-20',
            'description': 'A matchmaker connects Zoya with a cricket team captain, but things get complicated when she starts falling for him.',
            'director': 'Abhishek Sharma',
            'cast': ['Dhruv Vikram', 'Sonam Kapoor', 'Sanjay Kapoor', 'Vijay Raaz'],
            'poster_url': '/movie-posters/the-zoya-factor.jpg',
            'trailer_url': 'https://example.com/trailer11',
            'language': 'Hindi',
            'age_rating': 'PG-13',
            'price': 275.0
        }
    ]

    with app.app_context():
        # Clear existing movies
        Movie.query.delete()
        db.session.commit()

        # Add new movies
        for movie_data in movies_data:
            movie = Movie(
                id=movie_data['id'],
                title=movie_data['title'],
                genre=movie_data['genre'],
                rating=movie_data['rating'],
                duration=movie_data['duration'],
                release_date=datetime.strptime(movie_data['release_date'], '%Y-%m-%d').date(),
                description=movie_data['description'],
                director=movie_data['director'],
                cast=movie_data['cast'],
                poster_url=movie_data['poster_url'],
                trailer_url=movie_data['trailer_url'],
                language=movie_data['language'],
                age_rating=movie_data['age_rating'],
                price=movie_data['price']
            )
            db.session.add(movie)

        db.session.commit()
        print("Movies seeded successfully!")

def seed_seats():
    """Seed seats for each movie (10 rows x 10 seats per row = 100 seats per movie)."""
    with app.app_context():
        # Clear existing seats
        Seat.query.delete()
        db.session.commit()

        movies = Movie.query.all()

        for movie in movies:
            seats_to_create = []
            for row in ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']:
                for col in range(1, 11):  # 10 seats per row
                    seat_number = f"{row}{col}"
                    seat = Seat(
                        movie_id=movie.id,
                        seat_number=seat_number,
                        row=row,
                        column=col,
                        is_booked=False
                    )
                    seats_to_create.append(seat)

            # Bulk insert seats for this movie
            db.session.add_all(seats_to_create)
            db.session.commit()

        print("Seats seeded successfully!")

if __name__ == '__main__':
    seed_movies()
    seed_seats()
    print("Database seeded successfully!")