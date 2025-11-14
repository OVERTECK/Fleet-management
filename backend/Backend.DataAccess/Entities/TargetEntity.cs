namespace Backend.DataAccess.Entities;

public class TargetEntity
{
    public required Guid Id { get; init; }

    public CarEntity Car { get; init; }

    public required string CarId { get; init; }

    public DriverEntity Driver { get; init; }

    public required Guid DriverId { get; init; }

    public required DateTime Start { get; init; }

    public required DateTime End { get; init; }
}