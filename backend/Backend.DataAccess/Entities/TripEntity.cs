namespace Backend.DataAccess.Entities;

public class TripEntity
{
    public required Guid Id { get; init; }

    public CarEntity? Car { get; init; }

    public required string CarId { get; init; }

    public DriverEntity? Driver { get; init; }

    public required Guid DriverId { get; init; }

    public required DateTime TimeStart { get; init; }

    public required DateTime TimeEnd { get; init; }

    public required int TraveledKM  { get; init; }

    public required int ConsumptionLitersFuel { get; init; }

    public required Guid CreatedUserId { get; init; }
}