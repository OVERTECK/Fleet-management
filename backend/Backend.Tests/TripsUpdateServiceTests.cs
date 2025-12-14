using Backend.API.Services;
using Backend.API.Services.Abstraction;
using Backend.DataAccess.DTO.Requests;
using Backend.DataAccess.Entities;
using Backend.DataAccess.Repositories.Abstractions;
using Microsoft.Extensions.Logging;
using Moq;

namespace Backend.Tests;

public class TripsUpdateServiceTests
{
    private readonly Mock<ILogger<TripsService>> _loggerMock;
    private readonly Mock<ITripsRepository> _tripsRepositoryMock;
    private readonly Mock<ICarsRepository> _carsRepositoryMock;
    private readonly Mock<IDriversRepository> _driverRepositoryMock;
    private readonly Mock<ITripsCacheService> _tripsCacheServiceMock;
    
    private readonly TripsService _tripsService;

    public TripsUpdateServiceTests()
    {
        _loggerMock = new Mock<ILogger<TripsService>>();
        _tripsRepositoryMock = new Mock<ITripsRepository>();
        _carsRepositoryMock = new Mock<ICarsRepository>();
        _driverRepositoryMock = new Mock<IDriversRepository>();
        _tripsCacheServiceMock = new Mock<ITripsCacheService>();
        
        _tripsService = new TripsService(
            _loggerMock.Object,
            _tripsRepositoryMock.Object,
            _carsRepositoryMock.Object,
            _tripsCacheServiceMock.Object);
    }
    
    [Fact]
    public async Task CreateTrip_AddCarTraveledKmTests()
    {
        // Arrange
        var requestTrip = new UpdateTripRequest
        {
            Id = Guid.NewGuid(),
            CarId = "testVIN",
            DriverId = Guid.NewGuid(),
            TimeStart = DateTime.UtcNow.AddHours(-2),
            TimeEnd = DateTime.UtcNow,
            TraveledKM = 150,
            ConsumptionLitersFuel = 0,
            CreatedUserId = Guid.NewGuid(),
            Route = new List<CreateRouteRequest>
            {
                new()
                {
                    Latitude = 50.4501, 
                    Longitude = 30.5234,
                }
            }
        };

        var initialTotalKm = 1000;
        
        var car = new CarEntity
        {
            VIN = "testVIN",
            Number = "test",
            Model = "testModel",
            Status = "testStatus",
            TotalKM = initialTotalKm
        };

        var oldTraveledKm = 200;
        
        var expectedNewTotalKm = initialTotalKm - (oldTraveledKm - requestTrip.TraveledKM);
        
        _carsRepositoryMock
            .Setup(r => r.GetByVIN(It.IsAny<string>()))
            .ReturnsAsync(car);

        var oldTrip = new TripEntity
        {
            Id = requestTrip.Id,
            CarId = requestTrip.CarId,
            TimeStart = DateTime.Now,
            TimeEnd = DateTime.Now,
            TraveledKM = oldTraveledKm,
            DriverId = requestTrip.DriverId,
            CreatedUserId = requestTrip.CreatedUserId,
            ConsumptionLitersFuel = 0,
            Route = new List<RouteEntity>
            {
                new()
                {
                    Id = Guid.NewGuid(),
                    Latitude = 50.4501,
                    Longitude = 30.5234,
                    TripId = Guid.NewGuid(),
                }
            },
        };
        
        _tripsRepositoryMock
            .Setup(r => r.GetById(It.IsAny<Guid>()))
            .ReturnsAsync(oldTrip);
        
        CarEntity capturedCar = null;
            
        _carsRepositoryMock
            .Setup(r => r.Update(It.IsAny<CarEntity>()))
            .Callback<CarEntity>(updatedCar => capturedCar = updatedCar)
            .ReturnsAsync((CarEntity updatedCar) => updatedCar);
        
        _tripsRepositoryMock
            .Setup(s => s.Update(It.IsAny<TripEntity>()))
            .ReturnsAsync((TripEntity trip) => trip);

        // Act

        await _tripsService.Update(requestTrip);
        
        // Assert
        Assert.NotNull(capturedCar);
        Assert.Equal(expectedNewTotalKm, capturedCar.TotalKM);
    }
}