import React, { useState } from 'react';
import Sidebar from '../layout/Sidebar';
import PageHeader from '@/components/PageHeader';
import { useParams } from 'react-router-dom';
import { useGetApartmentReviewsQuery } from '@/api/api';
import { formatDateString, formatImageUrl } from '@/utils/functions';
import {
    FaArrowDown,
    FaArrowUp,
    FaQuoteLeft,
    FaQuoteRight,
    FaStar,
} from 'react-icons/fa';
import { Bar } from 'react-chartjs-2';
import { ChartData, ChartDataset, ChartOptions } from 'chart.js';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import Modal from '@/components/modal/Modal';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const ICON_COLOR = '#FFC534';

const ReviewsPage = () => {
    const { apartmentId } = useParams();
    if (!apartmentId) return null;
    const [currentImageUrl, setCurrentImageUrl] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: reviewsSummary } = useGetApartmentReviewsQuery(apartmentId);
    if (!reviewsSummary) return null;

    const datasets: ChartDataset<'bar'>[] = [
        {
            label: 'Average Ratings',
            data: [
                reviewsSummary.avgComfort,
                reviewsSummary.avgValue,
                reviewsSummary.avgOverall,
            ],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            borderColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            borderWidth: 1,
        },
    ];

    const data: ChartData<'bar'> = {
        labels: ['Comfort', 'Value for money', 'Overall experience'],
        datasets: datasets,
    };

    const options: ChartOptions<'bar'> = {
        scales: {
            y: {
                beginAtZero: true,
                max: 5,
            },
        },
    };

    return (
        <Sidebar>
            <PageHeader title={'Ratings'} />
            <>
                <div className={'summaryRating'}>
                    <div className={'summaryRating__count'}>
                        <div className={'summaryRating__count__row'}>
                            <div className={'summaryRating__count__row__title'}>
                                Number of reviews
                            </div>
                            <div
                                className={'summaryRating__count__row__number'}>
                                {reviewsSummary.reviews.length}
                            </div>
                            <div
                                className={'summaryRating__count__row__change'}>
                                {reviewsSummary.totalReservationsCount}{' '}
                                reservations
                            </div>
                        </div>
                        <div className={'summaryRating__count__row'}>
                            <div className={'summaryRating__count__row__title'}>
                                Average Rating
                            </div>
                            <div
                                className={'summaryRating__count__row__number'}>
                                {reviewsSummary.avgRating.toFixed(2)}
                            </div>

                            <div
                                className={'summaryRating__count__row__change'}>
                                {reviewsSummary.ratingChangePercentage >= 0 ? (
                                    <span
                                        className={
                                            'summaryRating__count__row__change__positive'
                                        }>
                                        <FaArrowUp color={'green'} />
                                        {`${reviewsSummary.ratingChangePercentage.toFixed(2)}% `}
                                    </span>
                                ) : (
                                    <span
                                        className={
                                            'summaryRating__count__row__change__negative'
                                        }>
                                        <FaArrowDown color={'red'} />
                                        {`${reviewsSummary?.ratingChangePercentage?.toFixed(2)}% `}
                                    </span>
                                )}
                                last year
                            </div>
                        </div>
                    </div>
                    <div className={'summaryRating__chart'}>
                        <Bar data={data} options={options} key={apartmentId} />
                    </div>
                </div>
                <div className={'reviewsHeader'}>Reviews</div>
                {reviewsSummary?.reviews?.length && (
                    <div className={'reviews'}>
                        {reviewsSummary.reviews.map((review) => {
                            return (
                                <div
                                    key={review.reviewId}
                                    className={'reviews__review'}>
                                    <div className={'reviews__review__header'}>
                                        <span
                                            className={
                                                'reviews__review__header__client'
                                            }>
                                            {review.reservation.clientName}
                                        </span>
                                        <span
                                            className={
                                                'reviews__review__header__rating'
                                            }>
                                            {[
                                                ...Array(review.comfortRating),
                                            ].map((x, i) => (
                                                <FaStar
                                                    key={i}
                                                    color={ICON_COLOR}
                                                />
                                            ))}
                                            <span>Comfort</span>
                                        </span>
                                        <span
                                            className={
                                                'reviews__review__header__rating'
                                            }>
                                            {[...Array(review.valueRating)].map(
                                                (x, i) => (
                                                    <FaStar
                                                        key={i}
                                                        color={ICON_COLOR}
                                                    />
                                                )
                                            )}
                                            <span>Value for money</span>
                                        </span>
                                        <span
                                            className={
                                                'reviews__review__header__rating'
                                            }>
                                            {[
                                                ...Array(
                                                    review.experienceRating
                                                ),
                                            ].map((x, i) => (
                                                <FaStar
                                                    key={i}
                                                    color={ICON_COLOR}
                                                />
                                            ))}
                                            <span>Overall experience</span>
                                        </span>
                                        <span
                                            className={
                                                'reviews__review__header__date'
                                            }>
                                            {formatDateString(
                                                review.createdAt.toString()
                                            )}
                                        </span>
                                    </div>
                                    {review.review && (
                                        <div
                                            className={'reviews__review__text'}>
                                            <div
                                                className={
                                                    'reviews__review__text__icon'
                                                }>
                                                <FaQuoteLeft
                                                    size={20}
                                                    color={'#6B6C6D'}
                                                />
                                            </div>
                                            <div
                                                className={
                                                    'reviews__review__text__textBody'
                                                }>
                                                {review.review}
                                            </div>
                                        </div>
                                    )}
                                    {review.imagesUrl && (
                                        <div
                                            className={
                                                'reviews__review__images'
                                            }>
                                            {review.imagesUrl.map(
                                                (image, index) => {
                                                    return (
                                                        <img
                                                            src={formatImageUrl(
                                                                image
                                                            )}
                                                            width={'100px'}
                                                            height={'100px'}
                                                            onClick={() => {
                                                                setCurrentImageUrl(
                                                                    image
                                                                );
                                                                setIsModalOpen(
                                                                    true
                                                                );
                                                            }}
                                                        />
                                                    );
                                                }
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
                <Modal
                    setIsModalOpen={setIsModalOpen}
                    isModalOpen={isModalOpen}>
                    <img src={formatImageUrl(currentImageUrl)} />
                </Modal>
            </>
        </Sidebar>
    );
};

export default ReviewsPage;
