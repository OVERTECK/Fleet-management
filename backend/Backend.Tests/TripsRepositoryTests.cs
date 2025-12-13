using Backend.DataAccess.Entities;
using Backend.DataAccess.Repositories;
using Backend.Tests.Common;
using Backend.Tests.Common.Factories;

namespace Backend.Tests;

public class TripsRepositoryTests : TestCommandBase<TripsContextFactory>
{
    [Fact]
    public async Task GetAllAsync_ReturnsAllTrips()
    {
        // Arrange

        var tripsRepository = new TripsRepository(Context);
        var expectedTrips = TripsContextFactory.Trips;
        
        // Act

        var result = await tripsRepository.GetAll();
        
        // Assert
        var expectedIds = expectedTrips.Select(t => t.Id).ToList();
        var resultIds = result.Select(t => t.Id).ToList();
        
        Assert.Equal(expectedIds, resultIds);
    }
    
    [Fact]
    public async Task GetByIdAsync_Success()
    {
        // Arrange

        var tripsRepository = new TripsRepository(Context);
        var expectedTrips = TripsContextFactory.Trips[0];
        
        // Act

        var result = await tripsRepository.GetById(expectedTrips.Id);
        
        // Assert
        
        Assert.NotNull(result);
        Assert.Equal(expectedTrips.Id, result.Id);
    }
    
    [Fact]
    public async Task GetByIdAsync_Throw()
    {
        // Arrange

        var tripsRepository = new TripsRepository(Context);
        
        // Act
        // Assert
        
        await Assert.ThrowsAsync<NullReferenceException>(
            async () => await tripsRepository.GetById(Guid.NewGuid()));
    }
    
    [Fact]
    public async Task GetByUserIdAsync_Success()
    {
        // Arrange

        var tripsRepository = new TripsRepository(Context);
        var userId = TripsContextFactory.Users[0].Id;
        var expectedTripsId = new List<TripEntity> { TripsContextFactory.Trips[0] }.Select(c => c.Id).ToList();
        
        // Act
        
        var resultTripsId = (await tripsRepository.GetByUserId(userId)).Select(t => t.Id).ToList();
        
        // Assert
        
        Assert.Equal(expectedTripsId, resultTripsId);
    }
    
    [Fact]
    public async Task CreateAsync_Success()
    {
        // Arrange

        var tripsRepository = new TripsRepository(Context);
        var trip = new TripEntity
        {
            Id = Guid.NewGuid(),
            DriverId = TripsContextFactory.Drivers[0].Id,
            CarId = TripsContextFactory.Cars[0].VIN,
            ConsumptionLitersFuel = 111,
            CreatedUserId = TripsContextFactory.Users[0].Id,
            TraveledKM = 11,
            TimeEnd = DateTime.Now,
            TimeStart = DateTime.Now,
            Route = TripsContextFactory.RoutesTripA
        };
        
        // Act
        
        await tripsRepository.Create(trip);
        
        // Assert
        
        Assert.Equal(trip.Id, Context.Trips.FirstOrDefault(c => c.Id == trip.Id).Id);
    }
}